import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    Settings,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.openai import OpenAI
from llama_index.core.memory import ChatMemoryBuffer

def open_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read().strip()

os.environ["OPENAI_API_KEY"] = open_file("key_openai.txt")

Settings.llm = OpenAI(
    model="gpt-4o-mini",
    temperature=0
)

SYSTEM_PROMPT = """
Bạn là nhân viên tư vấn bán máy ảnh chuyên nghiệp cho một cửa hàng máy ảnh.

Nguyên tắc:
- Chỉ sử dụng thông tin có trong tài liệu được cung cấp
- Không bịa thông tin nếu không có dữ liệu
- Giải thích dễ hiểu cho người mới
- Khi phù hợp, hãy gợi ý sản phẩm nên mua và giải thích lý do
- Văn phong thân thiện, đúng kiểu nhân viên tư vấn

Khi câu trả lời có gợi ý máy ảnh,
hãy trả về một khối ở CUỐI câu trả lời theo format sau:

<SUGGESTION_IDS>
12
15
</SUGGESTION_IDS>

Chỉ sử dụng ID máy ảnh có trong dữ liệu đã được cung cấp.
Nếu không chắc chắn, KHÔNG gợi ý.
Nếu không có gợi ý, KHÔNG thêm khối này.
Không giải thích gì thêm.

"""

def build_index(data_folder="data"):
    documents = SimpleDirectoryReader(data_folder).load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist("index_storage")
    return index


def load_index():
    storage_context = StorageContext.from_defaults(
        persist_dir="index_storage"
    )
    return load_index_from_storage(storage_context)

app = FastAPI(title="Camera Consultant Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

print("Đang khởi tạo dữ liệu tri thức...")

if not os.path.exists("index_storage"):
    index = build_index("data")
else:
    index = load_index()

print("Dữ liệu sẵn sàng!")

chat_sessions: Dict[str, any] = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    global index, chat_sessions

    if req.session_id not in chat_sessions:
        memory = ChatMemoryBuffer.from_defaults(token_limit=1500)

        chat_engine = index.as_chat_engine(
            chat_mode="context",
            memory=memory,
            system_prompt=SYSTEM_PROMPT,
            verbose=False
        )

        chat_sessions[req.session_id] = chat_engine

    chat_engine = chat_sessions[req.session_id]
    response = chat_engine.chat(req.message)

    return ChatResponse(answer=response.response)
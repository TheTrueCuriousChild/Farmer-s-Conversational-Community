from .chatbot.conversation_handler import ConversationHandler
from .chatbot.context_manager import ConversationContextManager
from .chatbot.response_generator import ResponseGenerator

class ChatbotService:
    def __init__(self, response_generator: ResponseGenerator,
                 context_manager: ConversationContextManager):
        self.handler = ConversationHandler(response_generator, context_manager)

    async def process_message(self, user_id: str, message: str, user_profile=None):
        return await self.handler.handle_user_message(user_id, message, user_profile)

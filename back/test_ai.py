import asyncio
from openai import AsyncOpenAI

async def test():
    client = AsyncOpenAI(api_key='sk-proj-nVt8SxPLUeuKmVDDIx6TT3BlbkFJLwUst1mfQjpMkYm5rBnQ')

    try:
        response = await client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'user', 'content': 'Say hello in 5 words'}
            ],
            max_tokens=20
        )
        print("SUCCESS: API Key works!")
        print(f"Response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"FAILED: API Key error: {e}")

asyncio.run(test())

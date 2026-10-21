import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        print("Navigating to http://localhost:5173")
        await page.goto("http://localhost:5173")

        # Wait for canvas to be present
        await page.wait_for_selector('canvas')
        print("Canvas found. Waiting 3 seconds for textures and data to load...")
        await page.wait_for_timeout(3000)

        # Click in the exact center of the screen
        # Since the globe is in the center, and it defaults to showing Africa/Europe,
        # clicking in the center (width/2, height/2) should hit Africa.
        viewport_size = page.viewport_size
        center_x = viewport_size["width"] / 2
        center_y = viewport_size["height"] / 2

        print(f"Clicking at ({center_x}, {center_y})")
        await page.mouse.click(center_x, center_y)

        # Wait a moment for UI to appear
        await page.wait_for_timeout(1000)

        print("Taking screenshot...")
        await page.screenshot(path="verification_5.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

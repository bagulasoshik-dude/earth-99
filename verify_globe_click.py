from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        page.goto("http://localhost:5173")
        print("Page loaded. Waiting for canvas...")
        page.wait_for_selector("canvas", timeout=10000)

        time.sleep(5)

        # Move mouse and hover to see if raycaster picks it up
        viewport = page.viewport_size
        center_x = viewport['width'] / 2
        center_y = viewport['height'] / 2

        page.mouse.move(center_x, center_y)
        time.sleep(1)
        page.mouse.down()
        time.sleep(0.1)
        page.mouse.up()

        time.sleep(2)

        print("Checking if country-panel exists...")
        panel = page.locator("#country-panel")
        if panel.count() > 0:
            print("Panel found! Text:", panel.inner_text())
        else:
            print("Panel NOT found in DOM.")

        page.screenshot(path="verification_click.png")

        browser.close()

if __name__ == "__main__":
    run()

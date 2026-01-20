from glob import glob

CURRENT_PROXY = "pixiv.nl"
TARGET_PROXY = "pixiv.nl"


def main():
    files = glob("source/**/*.md", recursive=True)
    for file_path in files:
        with open(file_path, "r") as file:
            content = file.read()

        if CURRENT_PROXY in content:
            updated_content = content.replace(CURRENT_PROXY, TARGET_PROXY)
            with open(file_path, "w") as file:
                file.write(updated_content)
            print(f"Updated proxy in: {file_path}")


if __name__ == "__main__":
    main()

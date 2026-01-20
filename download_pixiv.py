from pixivpy3 import AppPixivAPI
import os

# 请替换为你的 refresh_token
# 如何获取：登录 pixiv.net，打开开发者工具 (F12)，Network 标签，刷新页面，找到一个 API 请求，查看请求头或响应中的 refresh_token
refresh_token = "LnViwmWRV8kvUCyiPmWLnKEtL1yut26C8qeTDpbLgGs"

api = AppPixivAPI()
api.auth(refresh_token=refresh_token)

ids = [
    # ("111639285", 1),  # p1, 文件名 111639285-2.jpg
    # ("96078807", 0),  # p0, 96078807.jpg
    # ("99637663", 0),
    # ("85603133", 0),
    # ("126570679", 0),
    # ("105589501", 0),
    ("79639404", 1),  # 79639404-1.jpg
    ("101891205", 0),
    ("97389556", 0),
    ("122018493", 0),
    ("115766745", 0),
    ("120811830", 0),
    ("99637717", 0),
    ("93025943", 0),
]

os.makedirs("source/img/pixiv", exist_ok=True)

for artwork_id, page in ids:
    json_result = api.illust_detail(artwork_id)
    illust = json_result.illust
    if page == 0:
        url = illust.meta_single_page.original_image_url
        filename = f"{artwork_id}.jpg"
    else:
        url = illust.meta_pages[page].image_urls.original
        filename = f"{artwork_id}-{page + 1}.jpg"

    # 下载
    api.download(url, path="source/img/pixiv/", name=filename)
    print(f"Downloaded {filename}")

print("所有图片下载完成")

import os
import re

# 图片目录
img_dir = 'source/img/pixiv/'

# 替换函数
def replace_links(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换 index_img 和 banner_img
    pattern = r'(index_img|banner_img):\s*/img/pixiv/([^&\s]+)'
    def repl(match):
        img_name = match.group(2)
        return f'{match.group(1)}: https://wsrv.nl/?url=https://h2sxxa.github.io/img/pixiv/{img_name}&w=800&h=800'
    
    new_content = re.sub(pattern, repl, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

# 遍历所有 _posts 文件
posts_dir = 'source/_posts/'
for filename in os.listdir(posts_dir):
    if filename.endswith('.md'):
        replace_links(os.path.join(posts_dir, filename))

print("链接替换完成")
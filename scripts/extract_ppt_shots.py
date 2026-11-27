# -*- coding: utf-8 -*-
"""从 PPT 指定页抽取内嵌图片，输出到 public/projects/research-agent/。
用法: python scripts/extract_ppt_shots.py
"""
import os
import re
import shutil
import zipfile

PPTX = r"D:\下载\新建文件夹\文渊智研通跨领域科研学术辅助智能体项目介绍.pptx"
OUT = r"D:\个人网站\public\projects\research-agent"
SLIDES = [13, 14, 15, 16]

os.makedirs(OUT, exist_ok=True)
zf = zipfile.ZipFile(PPTX)
names = zf.namelist()

report = []
for n in SLIDES:
    rels_path = f"ppt/slides/_rels/slide{n}.xml.rels"
    if rels_path not in names:
        report.append(f"slide{n}: 无 rels")
        continue
    rels = zf.read(rels_path).decode("utf-8", "ignore")
    targets = re.findall(r'Target="\.\./media/([^"]+)"', rels)
    idx = 0
    for t in targets:
        member = f"ppt/media/{t}"
        if member not in names:
            report.append(f"slide{n}: 缺 {member}")
            continue
        data = zf.read(member)
        if len(data) < 30000:  # 过滤图标/装饰小图
            continue
        idx += 1
        ext = os.path.splitext(t)[1].lower()
        dst = os.path.join(OUT, f"slide{n}-{idx}{ext}")
        with open(dst, "wb") as f:
            f.write(data)
        report.append(f"slide{n}: {t} -> {os.path.basename(dst)}  {len(data)//1024} KB")
    if idx == 0:
        report.append(f"slide{n}: 无 >30KB 图片")

print("\n".join(report))

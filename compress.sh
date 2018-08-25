#!/bin/bash

folderPath='./build/jsb-default/res/raw-assets/'

maxSize='1M'    # 图片尺寸允许值
maxWidth=1280   # 图片最大宽度
maxHeight=1280  # 图片最大高度
quality=50      # 图片质量


# 压缩处理
# Param $folderPath 图片目录
function compress(){
 
    folderPath=$1
 
    if [ -d "$folderPath" ]; then
 
        for file in $(find "$folderPath" \( -name "*.png" \)); do
 
            echo $file
 
            # 调用imagemagick resize图片
            $(convert -resize 60%x60% "$file" -quality "$quality" -colorspace sRGB "$file")
 
        done
 
    else
        echo "$folderPath not exists"
    fi
}
 
# 执行compress
compress "$folderPath"
 
exit 0
import { useState, useEffect } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
/**
 *
 * 问题描述：ant-design中的 Upload并不好用，坑也比较多。
 * 比如经常遇到的一个问题是，当使用 fileList 进行受控后，onChange   事件就只能执行一次了。
 * 需求说明：对 Upload 组件进行二次封装，降低使用难度；还要求能配合 Form.Item 组件实现数据的双向绑定（自动取值）。
 */
// value, onChange 是Form.Item 给的。
const GkUpload = ({ value, onChange }) => {
  // 这个value就是那个被 Form.Item 双向绑定的 img 属性
  // 每次 value 变化，当前这个组件都会重新运行。
  // 解决编辑时，填充表单的问题，使用 fileList对Upload进行受控
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (value) {
      setFileList([
        {
          thumbUrl: "图片访问的baseURL" + value,
          name: Date.now(),
        },
      ]);
    }
  }, [value]);

  useEffect(() => {
    // 解决Form.Item的双向绑定问题
    if (fileList.length > 0) {
      const file = fileList[0];
      // 当图片真正上传成功后，把图片的可访问地址返回给父组件
      if (file.response && file.response.data) {
        // console.log('file', file)
        // 把fileList中img回传给父组件进行双向绑定
        onChange(file.response.data.img);
      }
    }
  }, [fileList]);

  // 问题：当Upload被fileList受控后，onChange只能打印一次。
  // 解决方案参考链接：https://github.com/ant-design/ant-design/issues/2423
  const imgChange = (ev) => {
    // console.log('ev fileList', ev.fileList)
    setFileList([...ev.fileList]);
  };

  // 当点击图片删除时，向父组件回传一个空字符串
  const imgRemove = () => onChange("");

  return (
    <ImgCrop rotate>
      <Upload
        name="后端接受图片数据的key名"
        action="上传图片的URL地址"
        listType="picture-card"
        onChange={imgChange}
        onRemove={imgRemove}
        maxCount={1}
        fileList={fileList}
      >
        {fileList.length > 0 ? "" : "+ Upload"}
      </Upload>
    </ImgCrop>
  );
};

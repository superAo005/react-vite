/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import {
  RedoOutlined,
  UndoOutlined,
  SettingOutlined,
  SafetyOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import { Button, Tooltip, InputNumber, Radio, List, Modal, Input, Select } from 'antd'
import { js_beautify } from 'js-beautify'
import { useDebounceEffect } from 'ahooks'
const { Option } = Select

import './index.scss'
// -- Monaco Editor Imports --
import * as monaco from 'csr!monaco-editor'

import useUpdate from './hooks/useUpdate'
// import { debounce } from '@/util/common'

// 编辑器的选项
const defaultOption = {
  automaticLayout: false, // 自适应布局
  scrollBeyondLastLine: true, // 取消代码后面空白
  // fixedOverflowWidgets: true, // 超出编辑器大小的使用fixed属性显示
  language: 'java',
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  fixedOverflowWidgets: false, // 超出编辑器大小的使用fixed属性显示
  theme: 'vs-dark',
  wordWrap: true, //折行展示
  minimap: {
    enabled: false, // 小地图
  },
}

export default function CodeEditor(props) {
  const {
    style,
    className,
    options,
    value,
    showFooter = true,
    showHead = true,
    height = 400,
    theme = 'vs-dark',
    language = 'java',
    side,
  } = props
  const { dataSource } = side
  const [curDataSource, setCurDataSource] = useState(dataSource?.[0] || [])

  const [searchVal, setSearchVal] = useState('')

  const [editor, setEditor] = useState(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [funcType, setFuncType] = useState('0')
  const editorRef = useRef(null)
  const mergeOptions = Object.assign({}, defaultOption, options, { language, theme })
  const editorDidMount = (editor) => {
    try {
      props?.editorDidMount && props?.editorDidMount(editor, monaco)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    editor?.dispose()
    const editorInstance = monaco.editor.create(editorRef.current, {
      value,
      ...mergeOptions,
    })

    setEditor(editorInstance)
    const javaFormatProvider = {
      provideDocumentFormattingEdits(model, options, token) {
        return [
          {
            text: js_beautify(model.getValue(), {
              e4x: false,
            }), // put formatted text here
            range: model.getFullModelRange(),
          },
        ]
      },
    }

    // TODO 格式化有问题，采用的 js 的 语法格式化，
    monaco.languages.registerDocumentFormattingEditProvider('java', javaFormatProvider)

    editorInstance.onDidChangeModelContent((event) => {
      props?.onChange && props?.onChange(editorInstance.getValue(), event)
    })
    editorDidMount(editorInstance)
    setIsEditorReady(true)

    return () => {
      editorRef.current = null
      editor?.dispose()
      console.log('卸载')
    }
  }, [])

  useUpdate(
    () => {
      if (value !== editor.getValue()) {
        editor.executeEdits('', [
          {
            range: editor.getModel().getFullModelRange(),
            text: value,
            forceMoveMarkers: true,
          },
        ])
        editor.pushUndoStop()
      }
    },
    [value],
    isEditorReady
  )
  const changeInsert = (val) => {
    if (editor) {
      let selection = editor.getSelection()
      editor.executeEdits(null, [
        {
          range: selection,
          text: val,
          forceMoveMarkers: true,
        },
      ])
    }
  }

  const openSideDetail = (val) => {
    Modal.info({
      title: '说明信息',
      content: val,
    })
  }

  const changeUndo = () => {
    if (editor) {
      editor.trigger('keyboard', 'undo', null)
    }
  }
  const changeRedo = () => {
    if (editor) {
      editor.trigger('keyboard', 'redo', null)
    }
  }

  const handleFind = () => {
    if (editor) {
      editor.trigger('keyboard', 'actions.find', null)
    }
  }

  const handleReplace = () => {
    if (editor) {
      editor.getAction('editor.action.startFindReplaceAction').run()
    }
  }
  const handleCompile = () => {
    props?.onCompile&& props.onCompile(editor.getValue())

  }

  const handleFormat = () => {
    if (editor) {
      editor.getAction('editor.action.formatDocument').run()
    }
  }

  const handleTest = () => {
    props?.onTest&& props?.onTest(editor.getValue())
  }
  const handleFontSize = (fontSize) => {
    if (editor) {
      console.log(fontSize)
      editor.updateOptions({
        fontSize,
      })
    }
  }
  const sideBarChange = (e) => {
    setFuncType(e.target.value)
    setCurDataSource(dataSource[e.target.value])
  }

  const handleThemeChange = (theme) => {
    if (editor) {
      monaco.editor.setTheme(theme)
    }
  }
  useDebounceEffect(
    () => {
      if (searchVal && side) {
        setCurDataSource(dataSource[funcType].filter(({ label }) => label.includes(searchVal)))
      } else {
        setCurDataSource(dataSource?.[funcType])
      }
    },
    [searchVal],
    {
      wait: 600,
    }
  )

  const renderSide = () => {
    if (!side) return null
    const { width, render, search = true } = side
    // setCurDataSource(dataSource[funcType])
    if (typeof render == 'function') {
      return (
        <div className="side_container" style={{ width: width + 'px' }}>
          {render()}
        </div>
      )
    }
    return (
      <div
        className={
          'side_container ' + search ? 'side_container  search' : 'side_container no_search'
        }
        style={{ width: width + 'px' }}>
        <div className="head_container ">
          <Radio.Group defaultValue={funcType} onChange={sideBarChange}>
            <Radio.Button value="0">数据视图</Radio.Button>
            <Radio.Button value="1">函数</Radio.Button>
            <Radio.Button value="2">特征</Radio.Button>
          </Radio.Group>
          {search && (
            <div className="search">
              <Input
                placeholder="输入名称搜索"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
          )}
        </div>
        <List
          size="small"
          dataSource={curDataSource}
          className="list_container"
          renderItem={(item) => (
            <List.Item
              actions={[
                <a
                  key="list-insert"
                  onClick={() => {
                    openSideDetail(item.detail)
                  }}>
                  说明
                </a>,
                <a
                  key="list-insert"
                  onClick={() => {
                    changeInsert(item.insertText)
                  }}>
                  插入
                </a>,
              ]}>
              {item.label}
            </List.Item>
          )}
        />
      </div>
    )
  }
  return (
    <>
      <div>
        {showHead && (
          <div className=" operate-container">
            <div className="btn-group">
              <Tooltip title="撤销">
                <Button className="btn" icon={<UndoOutlined />} onClick={changeUndo} />
              </Tooltip>

              <Tooltip title="重做">
                <Button className="btn" icon={<RedoOutlined />} onClick={changeRedo} />
              </Tooltip>
            </div>

            <div className="btn-group">
              <InputNumber
                className="risk-editor-font-size"
                min={12}
                max={30}
                defaultValue={14}
                onChange={handleFontSize}
              />
            </div>

            <div className="btn-group ml8">
              <Tooltip title="格式化">
                <Button icon={<CodeOutlined />} onClick={handleFormat} />
              </Tooltip>
            </div>

            <div className="btn-group ml8">
              <Select defaultValue={theme} style={{ width: 120 }} onChange={handleThemeChange}>
                <Option value="vs-dark">vs-dark</Option>
                <Option value="vs-dark">vs-dark</Option>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div
        className={'monaco_editor_container border ' + className}
        style={{ ...style, height: height + 'px' }}>
        <div id="monaco_editor" style={{ flex: 1 }} ref={editorRef}></div>
        {side && renderSide()}
      </div>

      {showFooter && (
        <div className="text-right operate-container">
          <Button icon={<SettingOutlined />} onClick={handleCompile}>
            编译
          </Button>
          <Button icon={<SafetyOutlined />} onClick={handleTest}>
            测试
          </Button>
        </div>
      )}
    </>
  )
}

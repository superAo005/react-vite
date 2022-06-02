/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import {
  RedoOutlined,
  UndoOutlined,
  SettingOutlined,
  SafetyOutlined,
  CodeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons'
import { Button, Tooltip, InputNumber, Radio, List, Modal, Input, Select } from 'antd'
import ProDescriptions from '@ant-design/pro-descriptions'

import { useDebounceEffect } from 'ahooks'

const { Option } = Select

import './index.scss'
// -- Monaco Editor Imports --
import * as monaco from 'csr!monaco-editor'

import useUpdate from './hooks/useUpdate'
import beautify from './utils'
// import { debounce } from '@/util/common'

// 编辑器的选项
const defaultOption = {
  automaticLayout: true, // 自适应布局
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


const detailLinks = [
  "/antifraud/feature-manage/data-view/detailsView?ruleNo=",
  "/antifraud/feature-manage/func/detailsView?ruleNo=",
  "/antifraud/feature-manage/feature/detailsView?ruleNo=",
  "/antifraud/cp-manager/attribute?ruleNo=",
]

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
  const { dataSource} = side

  const [curDataSource, setCurDataSource] = useState(dataSource?.[0] || [])
  const [searchVal, setSearchVal] = useState('')

  const [editor, setEditor] = useState(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [funcType, setFuncType] = useState('1')
  const editorRef = useRef(null)
  const rootRef = useRef(null)
  const mergeOptions = Object.assign({}, defaultOption, options, { language, theme })
  const editorDidMount = (editor) => {
    try {
      props?.editorDidMount && props?.editorDidMount(editor, monaco)
    } catch (error) {
      console.log(error)
    }
  }

 const  createEditor = ()=> {
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
            text: beautify(model.getValue()), // put formatted text here
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
  }

  useEffect(() => {
    createEditor()

    return () => {
      // editorRef.current = null
      editor?.dispose()
      console.log('卸载')
    }
  }, [])

  useUpdate(
    () => {
      console.log('useUpdate', value)

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

  useUpdate(() => {
    console.log('useUpdate', dataSource)
    // editor?.dispose()
    setFuncType("1")
    setCurDataSource(dataSource[1]?.filter(({ label }) => label.includes(searchVal)))

    createEditor()
    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['*'],

      provideCompletionItems: (model, position) => {
        const wordUntilPosition = model.getWordUntilPosition(position)
        let flatData = []
        if (Array.isArray(dataSource)) {
          flatData = dataSource.flat()
        }

        const suggestions = flatData.map((id) => ({
          label: id.label,
          kind: id.kind,
          documentation: id.documentation,
          insertText: id.insertText,
          detail: id.detail,
          // insertTextRules: id.insertTextRules || 1,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: wordUntilPosition.startColumn,
            endLineNumber: position.lineNumber,
            endColumn: wordUntilPosition.endColumn - 1,
          },
        }))
        return { suggestions, incomplete: true,  }
      },
    })
    return () => {
      // editorRef.current = null
      editor?.dispose()
      console.log('卸载')
    }
  
  }, [side?.dataSource?.flat()?.length])

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

  const openSideDetail = ( item) => {

    if(funcType!=4){
      window.open(`${detailLinks[funcType]}${item.label}`)
    }else{
      Modal.info({
        title: '描述信息',
        content: (  <ProDescriptions
          dataSource={item}
          // request={async () => {
          //   return Promise.resolve({
          //     success: true,
          //     data: {
          //     },
          //   })
          // }}
          column={1}
          columns={[
            {
              title: '视图名称',
              dataIndex: 'label',
              copyable: true,
            },
            {
              title: '视图描述',
              dataIndex: 'detail',
            },
            {
              title: '指标类型',
              dataIndex: 'dataType',
            },
            {
              title: '指标默认值',
              dataIndex: 'defaultValue',
            },
            
          ]}>
         
        </ProDescriptions>),
      })
    }
   
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
    props?.onCompile && props.onCompile(editor.getValue())
  }

  const handleFormat = () => {
    if (editor) {
      editor.getAction('editor.action.formatDocument').run()
    }
  }

  const handleTest = () => {
    props?.onTest && props?.onTest(editor.getValue())
  }
  const handleFontSize = (fontSize) => {
    if (editor) {
      console.log(fontSize)
      editor.updateOptions({
        fontSize,
      })
    }
  }

  const fullScreen = () => {
    if (!rootRef.current || !document.fullscreenEnabled) {
      return
    }
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      rootRef.current.requestFullscreen()
    }
  }
  const sideBarChange = (e) => {
    setFuncType(e.target.value)
    setCurDataSource(dataSource[e.target.value]?.filter(({ label }) => label.includes(searchVal)))
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
    const { width, render, search = true ,showTags=[true,true,true,true,false] } = side

    const tagContainer =  "tag_container tag_container_"+ showTags.filter(Boolean).length

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
          <Radio.Group defaultValue={funcType} value={funcType} onChange={sideBarChange} className={tagContainer }>
            {showTags[0] && <Radio.Button value="0">数据视图</Radio.Button>}
            {showTags[1] && <Radio.Button value="1">函数</Radio.Button>}
            {showTags[2] && <Radio.Button value="2">特征</Radio.Button>}
            {showTags[3] && <Radio.Button value="3">属性</Radio.Button>}
            {showTags[4] && <Radio.Button value="4">指标</Radio.Button>}
          </Radio.Group>
          {search && (
            <div className="search">
              <Input
                placeholder="输入名称搜索"
                value={searchVal}
                onPressEnter={(e) => {
                  e.preventDefault()
                }}
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
                  // href="/antifraud/feature-manage/func/detailsView?ruleNo=aceshi01"
                  // href={detailLinks[funcType] + item.label}
                  href="javascript:;"
                  onClick={() => openSideDetail(item)}
                  >
                  详情
                </a>,
                <a
                  key="list-insert"
                  onClick={() => {
                    changeInsert(item.insertText)
                  }}>
                  插入
                </a>,
              ]}>
              {/* <p className="list_item"> {item.label}</p> */}
              <List.Item.Meta title={item.label} description={<>
                <div>{item.dataType}</div>
                <div>{item.detail}</div>
              </>} />
              {/* {item.detail}   */}

            </List.Item>
          )}
        />
      </div>
    )
  }
  return (
    <div ref={rootRef} >
      <div>
        {showHead && (
          <div className=" operate-container">
            <div className="btn-group">
              <Tooltip title="撤销">
                <Button className="btn" icon={<UndoOutlined />} onClick={changeUndo}>
                  撤销
                </Button>
              </Tooltip>

              <Tooltip title="重做">
                <Button className="btn" icon={<RedoOutlined />} onClick={changeRedo}>
                  重做
                </Button>
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
                <Button icon={<CodeOutlined />} onClick={handleFormat}>
                  格式化
                </Button>
              </Tooltip>
            </div>

            <div className="btn-group ml8">
              <Select defaultValue={theme} style={{ width: 120 }} onChange={handleThemeChange}>
                <Option value="vs-light">vs-light</Option>
                <Option value="vs-dark">vs-dark</Option>
              </Select>
            </div>

            <div className="btn-group ml8">
                <Button
                  icon={<FullscreenOutlined />}
                  onClick={fullScreen}>
                </Button>
              </div>
          </div>
        )}
      </div>

      <div
        className={'monaco_editor_container border ' + className}
        style={{ ...style, height: height + 'px' }}>
                  {/* style={{ ...style,minHeight:"400px" ,maxHeight: `calc(100% - 100px)`}}> */}

        {/* <div id="monaco_editor" style={{ flex: 1 }} ref={editorRef}></div> */}
        <div
          id="monaco_editor"
          style={{ width: `calc(100% - ${side ? side?.width : 0}px)` }}
          ref={editorRef}></div>
        {side && renderSide()}
      </div>

      {showFooter && (
        <div className="text-right operate-container">
          <Button
            icon={<SettingOutlined />}
            onClick={handleCompile}
            style={{ marginRight: '10px' }}>
            编译
          </Button>
          <Button icon={<SafetyOutlined />} onClick={handleTest}>
            测试
          </Button>
        </div>
      )}
    </div>
  )
}

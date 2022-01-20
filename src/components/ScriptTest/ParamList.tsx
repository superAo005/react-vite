import React, { useState } from 'react'
import { Input, Col, Row } from 'antd'

const ParamList: React.FC<{
  value?: any[]
  onChange?: (value: any[]) => void
  inputParams?: any[]
}> = ({ value, onChange, inputParams }) => {
  const [inputValue, setInputValue] = useState<any[]>(value?.length > 0 ? value : inputParams)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    inputValue[index].value = e.target.value

    setInputValue(inputValue)
    onChange?.(inputValue)
  }

  const handleInputConfirm = () => {
    onChange?.(inputValue)
  }

  return (
    <Row>
      {(inputParams || []).map((item, index) => (
        <>
          <Col span={8} key={item.paramName} style={{ marginBottom: '10px' }}>
            <span style={{ width: '100%', display: 'inline-block' }}>{item.paramName}:</span>
            <Input
              type="text"
              size="small"
              style={{ width: '90%' }}
              value={inputValue[index]?.value}
              onChange={(val) => handleInputChange(val, index)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          </Col>
        </>
      ))}
    </Row>
  )
}

export default ParamList

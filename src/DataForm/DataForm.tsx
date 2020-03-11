import 'antd/dist/antd.css'
import { Form, InputNumber, Radio, Input, Select, Button} from 'antd'
import React from 'react'
import './DataForm.less'

const InputGroup = Input.Group
const { Option } = Select

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

export function DataForm () {
    return (
        <Form {...formItemLayout} layout="inline" className="fizicalParam">
            <Form.Item className="formItem" label="Возраст">
                <InputNumber className="numberInput Input" placeholder="Возраст" min={18} max={120}/>
            </Form.Item>
            <Form.Item className="formItem" label="Рост">
                <InputNumber className="numberInput Input" placeholder="Рост" min={100} max={240}/>
            </Form.Item>
            <Form.Item label="Вес">
                <InputNumber className="numberInput Input" placeholder="Вес" min={40} max={200}/>
            </Form.Item>
            <Form.Item label="Пол">
                <Radio.Group className="Input radioInput" defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="f">Женский</Radio.Button>
                    <Radio.Button value="m">Мужской</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Систолическое давление">
                <InputNumber className="numberInput Input" placeholder="Систолическое давление" min={40} max={200}/>    
            </Form.Item>
            <Form.Item label="Диастолическое давление">
                <InputNumber className="numberInput Input" placeholder="Диастолическое давление" min={40} max={200}/>
            </Form.Item>
            <Form.Item label="Холестерин">
                <InputGroup className="Input">
                    <Select defaultValue="Normal">
                        <Option value="Normal">Норма</Option>
                        <Option value="AboveNormal">Ниже нормы</Option>
                        <Option value="WellAboveNormal">Выше нормы</Option>
                    </Select>
                </InputGroup>
            </Form.Item>
            <Form.Item>
                <Button>Click to me!</Button>
            </Form.Item>
        </Form>
    )
}

export default DataForm
import 'antd/dist/antd.css'
import { Form, InputNumber, Radio, Input, Select} from 'antd'
import React from 'react'
import './AppLayout.css'

const InputGroup = Input.Group
const { Option } = Select

export function DataForm () {
    return (
        <Form layout="inline">
            <Form.Item className="formItem">
            <InputNumber className="numberInput Input" placeholder="Возраст" min={18} max={120}/>
            </Form.Item>
            <Form.Item className="formItem">
            <InputNumber className="numberInput Input" placeholder="Рост" min={100} max={240}/>
            </Form.Item>
            <InputNumber className="numberInput Input" placeholder="Вес" min={40} max={200}/>
            <Radio.Group className="Input radioInput" defaultValue="a" buttonStyle="solid">
                <Radio.Button value="f">Женский</Radio.Button>
                <Radio.Button value="m">Мужской</Radio.Button>
            </Radio.Group>
            <InputNumber className="numberInput Input" placeholder="Систолическое давление" min={40} max={200}/>
            <InputNumber className="numberInput Input" placeholder="Диастолическое давление" min={40} max={200}/>
            <InputGroup className="Input">
                <Select defaultValue="Normal">
                    <Option value="Normal">Норма</Option>
                    <Option value="AboveNormal">Ниже нормы</Option>
                    <Option value="WellAboveNormal">Выше нормы</Option>
                </Select>
            </InputGroup>
        </Form>
    )
}

export default DataForm
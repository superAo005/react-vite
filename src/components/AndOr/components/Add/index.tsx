/*
 * @Author: Charles.qu 
 * @Date: 2022-03-14 09:56:42 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-03-19 11:16:50
 */

import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { ADD } from '../../config/const';
import './index.scss';




interface IProp {
    data: any;
    addNode: Function;
}
const Add = (props: IProp) => {
    const { data } = props;
    const handleClick = () => {
        const { id, addNode } = data;
        addNode(id);

    }
    return <div className='add__con' onClick={handleClick} style={{ width: ADD, height: ADD }}>
        <PlusCircleFilled />

    </div>
}
export default Add;
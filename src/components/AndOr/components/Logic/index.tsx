/*
 * @Author: Charles.qu 
 * @Date: 2022-03-15 09:57:41 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-03-18 09:54:14
 */
import React from "react";
import { LOGIC } from '../../config/const'

import './index.scss';


export enum TYPE {
    OR = "OR",
    AND = "AND",
}

const mapType = {
    [TYPE.OR]: 'OR',
    [TYPE.AND]: 'AND'

}

export type IType = TYPE.AND | TYPE.OR

interface IProp {
    data: { type: IType },
}

const Logic = (props: IProp) => {

    const { data } = props;
    const { type } = data;
    const cls = type === TYPE.AND ? 'logic__con_text-and' : 'logic__con_text-or'
    return <div className="logic__con" style={{ width: LOGIC, height: LOGIC }}><span className={cls}>{mapType[type]}</span></div>
}
export default Logic;
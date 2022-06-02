import React from 'react';
import Add from '../components/Add';
import Logic from '../components/Logic';
import * as CONST from './const'




export enum NodeTypes {
    LOGIC = 'LOGIC',
    ADD = 'ADD',
}

// 注册node节点
export const nodes = {
    [NodeTypes.ADD]: {
        width: CONST.ADD,
        height: CONST.ADD,
        type: NodeTypes.ADD,
        component: Add
    },
    [NodeTypes.LOGIC]: {
        width: CONST.LOGIC,
        height: CONST.LOGIC,
        type: NodeTypes.LOGIC,
        component: Logic
    },
}

export const node = (type: any, other: any = {}, nodes: any = {}) => {
    const node = nodes[type];
    const { width, height, component: Cmp, props } = node;
    if (!Cmp) {
        throw new Error('component is not exist');
    }
    const data = {
        ...other,
        height: height,
        width: width,
    }
    return { ...node, component: <Cmp data={data} {...props} /> }
}

export const getCmp = (type: any, other: any = {}, nodes: any = {}) => {
    return {
        shape: 'react-shape',
        ...node(type, other, nodes),
    }
}

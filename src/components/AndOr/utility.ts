/*
 * @Author: superao 
 * @Date: 2022-03-16 15:38:26 
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-19 16:24:23
 */

import { Graph } from '@antv/x6';
import { addPrefix, logicPrefix } from './config/const'
import * as CONST from './config/const'


const HEIGHT = Symbol.for('ANDOR#height');
const POSITONY = Symbol.for('ANDOR#positonY');
const LAST = Symbol.for('ANDOR#last');


/**
 * 计算节点位置
 * @param data 
 * @param i 
 * @param arr 
 * @returns 
 */
export const calculatePosition = (data: any, i = 0, arr = [data]) => {
    const {
        conditions,
    } = data;
    if (!conditions || !conditions.length) {
        data[HEIGHT] = CONST.INPUTHEIGHT;
    } else {
        const s = conditions.map((v: any, i: number, arr: any) => {
            const temp = calculatePosition(v, i, arr);
            if (i === 0) {
                temp[POSITONY] = 0;
            } else {
                temp[POSITONY] = arr[i - 1][POSITONY] + arr[i - 1][HEIGHT];
            }
            if (i === arr.length - 1) {
                temp[LAST] = true;
            } else {
                temp[LAST] = false;
            }
            return temp
        });
        data[HEIGHT] = s.reduce((acc: number, cur: any) => {
            return acc + cur[HEIGHT];
        }, 0);
    }
    return data;
}

/**
 * 计算节点相对位置
 * @param self 
 * @param reference 
 * @returns 
 */
export const calRelativeYPositon = (self: number, reference: number): number => {
    return (reference - self) / 2;
}

/**
 * 原始数据添加type
 * @param data 
 * @param type 
 * @param index 
 * @returns 
 */
export const addTypeToData = (data: any, type: Array<any>, index = 0): Record<string, any> => {
    const { conditions = [] } = data || {};
    if (conditions && type[index]) {
        data['type'] = type[index];
        for (const item of conditions) {
            addTypeToData(item, type, index + 1);
        }
    }
    return data;
}

/**
 * node缓存
 */
const cacheNode = new WeakMap();

/**
 * 根据id获取数据
 * @param id 
 * @param data 
 * @returns {data: id所在数据, parentData: 父辈数据, index: 父辈数组中的index}
 */
export const getItemById = (id: string, data = {}, graph: Graph): { data: any, parentData: any, index: number } => {
    // const cell = graph.getCellById(id);
    // if (cacheNode.get(cell)) {
    //     return cacheNode.get(cell)
    // }
    let res: { data: any, parentData: any, index: number } = { data: null, parentData: null, index: 0 };
    (function innerRecursion(id: string, data = {}) {
        const {
            conditions = []
        } = data as any;
        for (const index in conditions) {
            const item = conditions[index];
            const {
                id: itemId
            } = item;
            if (itemId) {
                if (String(itemId) === String(id)) {
                    if (!res.data) {
                        res = { data: item, parentData: data, index: Number(index) };
                    }
                } else {
                    innerRecursion(id, item);
                }
            }

        }
        return res;
    })(id, data);
    // cacheNode.set(cell, res);
    return res;
}

/**
 * 获取初始化数据
 * @param id 
 * @param data 
 * @returns 
 */
export const getInitObj = (id: string, data = {}, graph: Graph): Record<string, any> => {
    const res = {};
    const { parentData: item } = getItemById(id, data, graph);

    (function innerRecursion(data = {}, res: any) {
        const {
            conditions
        } = data as any;
        if (conditions && Array.isArray(conditions) && conditions.length) {
            const item = conditions[0];
            const { conditions: subCondition, logical, type } = item;
            res['logical'] = logical;
            res['type'] = type;
            res['id'] = generateid();
            if (subCondition) {
                res['conditions'] = [{ id: generateid() }];
                innerRecursion(subCondition, res['conditions'][0]);
            }
        }
    })(item, res);
    return res

}


/**
 * 删除数据，如果父辈的condition的长度为一，则删除父辈
 * @param id 
 * @param data 
 * @returns 删除数据的节点列表
 */
export const getDelNodeIds = (id: string, data: Record<string, any>, graph: Graph): Array<string> => {
    let res: Array<string> = [];
    (function recursion(id: string) {
        res.push(id, getAddNodeId(id, addPrefix), getAddNodeId(id, logicPrefix));
        const { parentData, index } = getItemById(id, data, graph);
        if (parentData) {
            const { conditions = [], id: subId } = parentData;
            if (conditions.length === 1) {
                recursion(subId);
            } else {
                conditions.splice(index, 1);
            }
        } else {
            res = [];
        }

    })(id)
    return res;
}

/**
 * 生成唯一ID
 * @param len 
 * @param radix 
 * @returns 
 */
function generateid(len = 8, radix = 16) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    radix = radix || chars.length;

    if (len) {
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return `node_${uuid.join('')}`;
}

/**
 * 获取节点名称
 * @param id 
 * @param prefix 
 * @returns 
 */
export const getAddNodeId = (id: string, prefix = ''): string => {
    return `${prefix}${id}`
}


export const fillTheId = (data: any) => {
    const { conditions } = data || {};
    if (Array.isArray(conditions)) {
        conditions.forEach((v: any) => {
            const { id } = v;
            v['id'] = id || generateid();
            fillTheId(v)
        })
    }
}


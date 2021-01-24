import vnode from './vnode.js';
import createElement from './createElement.js';
import patchVnode from './patchVnode.js';

export default function patch(oldVnode, newVnode) {
    // 判断传入的第一个参数是真实DOM还是虚拟节点
    if (oldVnode.sel == '' || oldVnode.sel == undefined) {
        // 传入的第一个参数是真实DOM，需要包装成虚拟节点
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }
    // 判断oldVnode和newVnode是不是同一个节点
    if (oldVnode.sel == newVnode.sel && oldVnode.key == newVnode.key) {
        // 是同一个节点
        // 精细化比较
        patchVnode(oldVnode, newVnode);
    } else {
        // 不是同一个节点，插入新的删除旧的
        // 得到新节点
        let newVnodeElm = createElement(newVnode, oldVnode.elm);
        // 插入到老节点之前
        if (oldVnode.elm && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }
        // 删除老节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
};
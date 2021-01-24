import createElement from './createElement.js';
import updateChildren from './updateChildren.js';
// 对比同一个虚拟节点
export default function patchVnode(oldVnode, newVnode) {
    // 判断新旧Vnode是不是同一个对象
    if (oldVnode === newVnode) return;
    // 判断newVnode有没有text属性
    if (newVnode.text != undefined && (newVnode.children == undefined || newVnode.children.length == 0)) {
        // newVnode有text属性
        // 新老vnode的text不同,新text写到老elm中（老vnode中即使有children也会消失）
        if (newVnode.text != oldVnode.text) {
            oldVnode.elm.innerText = newVnode.text;
        }
    } else {
        // newVnode没有text属性，有children属性
        // 判断oldVnode有没有children
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            // 新老vnode都有children
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // oldVnode没有children,newVnode的有
            // 清空老节点的内容
            oldVnode.elm.innerHTML = '';
            // 遍历新节点，创建DOM，上树
            for (let i = 0; i < newVnode.children.length; i++) {
                let dom = createElement(newVnode.children[i]);
                oldVnode.elm.appendChild(dom);
            }
        }
    }

};
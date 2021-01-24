// 真正创建节点（孤儿节点）
export default function createElement(vnode, pivot) {
    // 创建一个真实DOM，是孤儿节点
    let domNode = document.createElement(vnode.sel);
    // 判断虚拟节点里的是子节点还是文字
    if ((vnode.children == undefined || vnode.children.length == 0) && vnode.text != '') {
        // 虚拟节点里的是文本
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 虚拟节点里的是子节点要递归创建新DOM
        for (let i = 0; i < vnode.children.length; i++) {
            // 子虚拟节点
            let ch = vnode.children[i];
            // 递归形成子节点
            let chDom = createElement(ch);
            // 子节点追加到上层节点
            domNode.appendChild(chDom);
        }
    }
    // 补充elm属性
    vnode.elm = domNode;
    // 返回elm，elm属性是纯DOM对象
    return vnode.elm;
};
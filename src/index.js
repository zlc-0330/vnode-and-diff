import h from './mysnabbdom/h.js';
import patch from './mysnabbdom/patch.js';
// 得到container
const container = document.getElementById('container');
// 得到btn
const btn = document.getElementById('btn');
// 创建虚拟节点
const vnode1 = h('ul', {}, [
    h('li', { key: 'A' }, "A"),
    h('li', { key: 'B' }, "B"),
    h('li', { key: 'C' }, "C"),
    h('li', { key: 'D' }, "D"),
]);

const vnode2 = h('ul', {}, [
    h('li', { key: 'D' }, "D"),
    h('li', { key: 'A' }, "A"),
    h('li', { key: 'j' }, "j"),
    h('li', { key: 'B' }, "B"),
    h('li', { key: 'C' }, "C"),
]);
// 虚拟节点上树
patch(container, vnode1);
// 按钮事件监听
btn.onclick = function() {
    patch(vnode1, vnode2);
};
import vnode from './vnode.js';
// 低配版h函数，必须接收三个参数，重载功能较弱
// 调用时必须是下列三中之一
// 1.h('div',{},'文字')
// 2.h('div',{},[])
// 3.h('div',{},h())
export default function(sel, data, c) {
    // 检查参数个数
    if (arguments.length != 3) {
        throw new Error('h函数必须传入三个参数！');
    }
    // 判断参数c的类型
    if (typeof c == "string" || typeof c == "number") {
        // 第一种情况
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        // 第二种情况
        // 遍历数组收集children
        let children = [];
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] == 'object' && c[i].hasOwnProperty('sel')) {
                children.push(c[i]);
            } else {
                throw new Error('传入的数组中有的项不是h函数');
            }
        }
        // 返回vnode
        return vnode(sel, data, children, undefined, undefined);

    } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
        // 第三种情况
        // 直接把c放进children中
        let children = [c];
        return vnode(sel, data, children, undefined, undefined);
    }
};
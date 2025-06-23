const p1 = {
    lastName: '张',
    firstName: '三',
    get fullName() {
        console.log(1)
        return this.lastName + this.firstName;
    }
}

const proxy = new Proxy(p1, {
    get(target, key, receiver) {
        console.log('触发 getter',key);
        return Reflect.get(target, key, receiver);
        return target[key];
    }
})

console.log(proxy.fullName)
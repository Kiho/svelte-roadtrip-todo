interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

interface IOptions {
    target?: Element
    data?: any;
}
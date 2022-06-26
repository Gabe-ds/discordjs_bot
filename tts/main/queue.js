const createQueue = () => {
    const queue = [];
    
    return { put: x => { queue.push(x) }, get: () => queue.shift() };
};
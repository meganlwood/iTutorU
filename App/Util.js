export function generateConvoKey(id1, id2) {
    var arr = [id1, id2];
    arr.sort();
    var convoKey = arr[0] + arr[1];
    return convoKey;
}
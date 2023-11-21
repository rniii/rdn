const keySlot = Symbol();

const isArray = Array.isArray;

const parseValue = (src: string) => {
    if (/^n(i|ul)l$/.test(src)) {
        return null;
    }
    if (/^(tru|fals)e$/.test(src)) {
        return src > "t";
    }
    if (src == "nan") {
        return +src;
    }
    if (!isNaN(+src.replace(/n$/i, ""))) {
        if (/n$/i.test(src)) {
            return BigInt(src.slice(0, -1));
        }
        return +src;
    }
    return src.replace(/^:/, "");
}

/**
 * Parse RDN data.
 *
 * @param root - the base object to be extended. Defaults to an empty object.
 * @returns the root object.
 */
export const parse = (src: string, root: any = {}) => {
    let input = src;
    let node = root;
    let c;
    let key;
    const parents: any[] = [];

    const push = (child: any, parent: any) => {
        if (isArray(parent)) {
            parent.push(child);
        } else if (key = parent[keySlot]) {
            if (isArray(key)) {
                // TODO: insert at current table, without nesting somehow
                node = root[key[0]] ??= {};
                node[keySlot] = child;
            } else {
                parent[key] = child;
            }
            delete parent[keySlot];
        } else {
            parent[keySlot] = child;
        }
    };

    const advance = (n = 1, v = input.slice(0, n)) => {
        input = input.slice(n)
        return v;
    }

    const error = (reason: string) => { throw Error(reason + " at position " + (src.length - input.length)) };

    for (;;) {
        advance(/[^\s,:=]|$/.exec(input)!.index);
        if (!input) return root;

        c = input[0];
        if (c == "{" || c == "[") {
            advance();
            parents.push(node);
            node = c == "{" ? {} : [];
        } else if (c == "}" || c == "]") {
            advance();
            if (c == "}" == isArray(node)) error("unmatched bracket");
            push(node, node = parents.pop() ?? error("unexpected bracket"));
        } else {
            push(
                c == '"'
                    ? JSON.parse(advance((/"(\\.|.)*?"/.exec(input) ?? error("unterminated string"))[0].length))
                    : parseValue(advance(/[\s,:={}[\]]|$/.exec(input)!.index)),
                node
            );
        }
    }
}

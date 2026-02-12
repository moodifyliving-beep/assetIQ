/**
 * Stub for optional/test-only deps (why-is-node-running, tape, tap, desm, etc.)
 * so the bundler can resolve them when node_modules test files are pulled in.
 */
function noop() {}
const stub = noop
stub.test = noop
stub.join = (...args) => args.join('/')
module.exports = stub

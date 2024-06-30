export default function expectDefined<T> (arg: T): asserts arg is NonNullable<T> {
  expect(arg).toBeDefined()
}

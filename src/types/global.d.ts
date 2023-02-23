declare module 'transumtor' {
  const Transmutor: (Module: any) => Promise<any>;
  namespace Transmutor {}
  export = Transmutor;
}
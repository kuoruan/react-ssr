import * as Redux from "redux";

declare module "redux" {
  /**
   * Overload for bindActionCreators redux function, returns expects responses
   * from thunk actions
   */
  function bindActionCreators<
    TActionCreators extends ActionCreatorsMapObject<any>
  >(
    actionCreators: TActionCreators,
    dispatch: Dispatch
  ): {
    [TActionCreatorName in keyof TActionCreators]: ReturnType<
      TActionCreators[TActionCreatorName]
    > extends ThunkAction<any, any, any, any>
      ? (
          ...args: Parameters<TActionCreators[TActionCreatorName]>
        ) => ReturnType<ReturnType<TActionCreators[TActionCreatorName]>>
      : TActionCreators[TActionCreatorName];
  };

  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  export interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
      thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, A>
    ): TReturnType;
  }

  expect = Redux;
}

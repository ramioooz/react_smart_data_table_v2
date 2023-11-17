import { createContext, useReducer } from "react";
import { isNumeric } from "../utils/methods";

type stateType = {
  pageSize: number;
  catchedRecords: any[];
  totalRecords: number;
  displayRecords: any[];
};

const initialState: stateType = {
  pageSize: 0,
  catchedRecords: [],
  totalRecords: 0,
  displayRecords: [],
};

type contextType = {
  state: stateType;
  //   TABLE_INIT: () => void;
  //   TABLE_REPLACE_RECORDS: () => void;
  //   TABLE_SORT_RECORDS: () => void;
  //   TABLE_SEARCH_RECORDS: () => void;
  //   dispatch: React.Dispatch<{ type: string; value: unknown }>;
  dispatch: React.Dispatch<reducerActionType>;
};

const initValue: contextType = {
  state: initialState,
  //   TABLE_INIT: () => {},
  //   TABLE_REPLACE_RECORDS: () => {},
  //   TABLE_SORT_RECORDS: () => {},
  //   TABLE_SEARCH_RECORDS: () => {},
  dispatch: () => {},
};

// export const TableDataContext = createContext<contextType>(initValue);
export const TableDataContext = createContext(initValue);

export const enum context_action_enum {
  TABLE_INIT,
  TABLE_REPLACE_RECORDS,
  TABLE_SORT_RECORDS,
  TABLE_SEARCH_RECORDS,
}

type reducerActionType = {
  type: context_action_enum;
  payload?: {
    [key: string]: any;
  };
};

const reducer = (state: stateType, action: reducerActionType): stateType => {
  switch (action.type) {
    case context_action_enum.TABLE_INIT: {
      // here we init local/catched state object
      // the expected payload should look
      // like: { pageSize: xxx, recordsToAdd: [list of objects], totalRecords: num  }
      const { pageSize, recordsToAdd, totalRecords } = action.payload!;

      const updatedState: stateType = {
        pageSize: parseInt(pageSize),
        catchedRecords: [...recordsToAdd],
        totalRecords: parseInt(totalRecords),
        displayRecords: [...recordsToAdd],
      };
      return updatedState;
    }

    case context_action_enum.TABLE_REPLACE_RECORDS: {
      // <-- temp
      // the payload should look like { recordsToAdd: [...] }
      const { recordsToAdd } = action.payload!;
      // console.log('updatedState: ', updatedState);

      const updatedState: stateType = {
        ...state,
        catchedRecords: recordsToAdd,
        displayRecords: recordsToAdd,
      };
      return updatedState;
    }

    case context_action_enum.TABLE_SORT_RECORDS: {
      // here the payload should look like {sortBy: xxx, sortType}
      // console.log('payload is: ', action.payload);
      const { sortBy, sortType } = action.payload!;
      const updatedDisplayRecords = [...state.displayRecords];
      const compareFn = (a: any, b: any) => {
        // check if properties to compare is numeric
        // if so - do a numeric comparison.
        // otherwise do a string comparison.
        if (isNumeric(a[sortBy])) {
          if (sortType == "ASC") {
            return a[sortBy] - b[sortBy];
          }
          return b[sortBy] - a[sortBy];
        } else {
          // do string (case-insensitive) comparison here..
          const A_upper = a[sortBy].toString().toUpperCase(); // ignore upper and lowercase
          const B_upper = b[sortBy].toString().toUpperCase(); // ignore upper and lowercase
          if (A_upper < B_upper) {
            // return -1;
            if (sortType == "ASC") {
              return -1;
            } else {
              return 1;
            }
          } else if (A_upper > B_upper) {
            //   return 1;
            if (sortType == "ASC") {
              return 1;
            } else {
              return -1;
            }
          }
          return 0;
        }
      };
      updatedDisplayRecords.sort(compareFn); // <-- here records array will be sorted in place
      const updatedState = {
        ...state,
        displayRecords: updatedDisplayRecords,
      };
      // console.log('updatedState: ', updatedState);
      return updatedState;
    }

    case context_action_enum.TABLE_SEARCH_RECORDS: {
      // here we filter catched records using given keyword/searchTerm
      // the filtered list will be placed in displayRecords object
      // the payload should look like { searchTerm: "John" }
      // the search should be case-insensitive
      const { searchTerm } = action.payload!;
      const catchedRecords = state.catchedRecords;
      const filteredRecords = catchedRecords.filter((obj) => {
        // console.log('obj string: ', JSON.stringify(obj));
        return JSON.stringify(obj)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      const updatedState = {
        ...state,
        displayRecords: filteredRecords,
      };
      // console.log('updatedState: ', updatedState);
      return updatedState;
    }
    default:
      return state;
  }
};

export const TableDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log('TableDataContext state is : ', state);

  return (
    <TableDataContext.Provider value={{ state, dispatch }}>
      {children}
    </TableDataContext.Provider>
  );
};

import { useContext, useEffect, useRef, useState } from "react";
import {
  TableDataContext,
  context_action_enum,
} from "../context/TableDataContext";
import axios from "axios";
import { useTableType } from "../utils/types";

// import { RedisClientType, createClient } from "redis";

// var redisClient : RedisClientType<any>;

// useEffect(() => {
//   redisClient = createClient({
//     password: "HmGdtkSF2TqlaFoCKn6xIXXWpu3xevde",
//     socket: {
//       host: "redis-15293.c311.eu-central-1-1.ec2.cloud.redislabs.com",
//       port: 15293,
//     },
//   });
// }, []);

export const useTable = ({
  dataSourceUrl,
  columns_to_display,
}: useTableType) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentPageNum = useRef(1);
  const totalPages = useRef(0);
  const numbersArray: React.MutableRefObject<number[]> = useRef([]);

  const sortingBy = useRef("");
  const sortingTypes = ["ASC", "DES"];
  const selectedSortTypeRef = useRef(sortingTypes[0]); // initial value

  const { dispatch } = useContext(TableDataContext);

  const initTableFn = async (recordsPerPage: number) => {
    if (!isLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await axios.get(
        `${dataSourceUrl}/?limit=${recordsPerPage}`
      );
      // console.log('response is: ', response);

      if (response.status == 200) {
        // init currentPageNum
        currentPageNum.current = 1;

        totalPages.current = Math.ceil(response.data.total / recordsPerPage);

        numbersArray.current = [...Array(totalPages.current + 1).keys()].slice(
          1
        ); // ex. [1,2,3,4]

        // check if columns_to_display are valid
        // and corresponds to the keys of a recored
        // on the returned records list
        let records_list = Object.values<any[]>(response.data)[0] || [];
        let record_keys: string[] = Object.keys(records_list[0]); // represents the first object in records list

        const bigArray = record_keys.map((k) => k.toLowerCase());
        const smallArray = columns_to_display.map((k) => k.toLowerCase());
        const keysMatch = smallArray.every((r) => bigArray.includes(r));
        // console.log('birArray: ', bigArray);
        // console.log('smallArray: ', smallArray);
        // console.log('keysMatch: ', keysMatch);
        if (!keysMatch) {
          let msg = `columns_to_display is invalid`;
          throw msg;
        }
        // init sortingBy and selectedSortTypeRef
        sortingBy.current = columns_to_display[0];
        selectedSortTypeRef.current = sortingTypes[0];

        dispatch({
          type: context_action_enum.TABLE_INIT,
          payload: {
            pageSize: recordsPerPage,
            recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]).
            totalRecords: response.data.total,
          },
        });
      } else {
        throw response.statusText;
      }
    } catch (error) {
      let msg = `initTableFn Error: ${error}`;
      console.log(msg);
      setError(msg);
    }

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  const nextPageFn = async (recordsPerPage: number) => {
    console.log("nextPageFn..");

    // ------TO BE IMPLEMENTED ------------------
    // here we will try to look the page
    // in the catched context.
    // if found - return the catched page
    // if not - contact the server to get the page
    // -----------------------------------------

    const newPageNum = currentPageNum.current + 1;

    if (newPageNum > totalPages.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${dataSourceUrl}/?limit=${recordsPerPage}&skip=${
          (newPageNum - 1) * recordsPerPage
        }`
      );
      // console.log('response is: ', response);

      if (response.status == 200) {
        currentPageNum.current = newPageNum; // <-- very important

        dispatch({
          type: context_action_enum.TABLE_REPLACE_RECORDS,
          payload: {
            recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]).
          },
        });
        // and apply existing sorting criteria
        dispatch({
          type: context_action_enum.TABLE_SORT_RECORDS,
          payload: {
            sortBy: sortingBy.current,
            sortType: selectedSortTypeRef.current,
          },
        });
      } else {
        throw response.statusText;
      }
    } catch (error) {
      let msg = `fetchData Error: ${error}`;
      console.log(msg);
      setError(msg);
    }

    setIsLoading(false);
  };

  const previousPageFn = async (recordsPerPage: number) => {
    console.log("previousPageFn..");

    // ------TO BE IMPLEMENTED ------------------
    // here we will try to look the page
    // in the catched context.
    // if found - return the catched page
    // if not - contact the server to get the page
    // -----------------------------------------

    const newPageNum = currentPageNum.current - 1;

    if (newPageNum < 1) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${dataSourceUrl}/?limit=${recordsPerPage}&skip=${
          (newPageNum - 1) * recordsPerPage
        }`
      );
      // console.log('response is: ', response);

      if (response.status == 200) {
        currentPageNum.current = newPageNum; // <-- very important

        dispatch({
          type: context_action_enum.TABLE_REPLACE_RECORDS,
          payload: {
            recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]).
          },
        });
        // and apply existing sorting criteria
        dispatch({
          type: context_action_enum.TABLE_SORT_RECORDS,
          payload: {
            sortBy: sortingBy.current,
            sortType: selectedSortTypeRef.current,
          },
        });
      } else {
        throw response.statusText;
      }
    } catch (error) {
      let msg = `fetchData Error: ${error}`;
      console.log(msg);
      setError(msg);
    }

    setIsLoading(false);
  };
  const goToPageFn = async (recordsPerPage: number, pageNum: number) => {
    console.log("goToPageFn..");

    const newPageNum = pageNum;

    if (!numbersArray.current.includes(pageNum)) {
      console.log("goToPageFn error: pageNum is invalid");
      return;
    }

    setIsLoading(true);
    setError(null);

    

    try {

      // redisClient.get("ddd");

      const response = await axios.get(
        `${dataSourceUrl}/?limit=${recordsPerPage}&skip=${
          (newPageNum - 1) * recordsPerPage
        }`
      );

      // redisClient.setEx(`page: (${pageNum})`, 3600, JSON.stringify(response.data));


      // console.log('response is: ', response);

      if (response.status == 200) {
        currentPageNum.current = newPageNum; // <-- very important

        dispatch({
          type: context_action_enum.TABLE_REPLACE_RECORDS,
          payload: {
            recordsToAdd: Object.values(response.data)[0], // <-- represents the first property in the response object. ex. (products: [...]).
          },
        });
        // and apply existing sorting criteria
        dispatch({
          type: context_action_enum.TABLE_SORT_RECORDS,
          payload: {
            sortBy: sortingBy.current,
            sortType: selectedSortTypeRef.current,
          },
        });
      } else {
        throw response.statusText;
      }
    } catch (error) {
      let msg = `fetchData Error: ${error}`;
      console.log(msg);
      setError(msg);
    }

    setIsLoading(false);
  };

  const sortFn = async (
    sortBy: string,
    desiredSortingType = selectedSortTypeRef.current
  ) => {
    // console.log('sortFn..');

    sortingBy.current = sortBy; // <-- IMPORTANT
    selectedSortTypeRef.current = desiredSortingType;

    // console.log(`sortingBy: ${sortBy}, sortType: ${selectedSortTypeRef.current}`);

    // rearrange catched records according to 'sortBy' and 'sortType'
    dispatch({
      type: context_action_enum.TABLE_SORT_RECORDS,
      payload: { sortBy, sortType: selectedSortTypeRef.current },
    });
  };

  return {
    initTableFn,
    nextPageFn,
    previousPageFn,
    goToPageFn,
    sortFn,
    currentPageNum: currentPageNum.current,
    numbersArray: numbersArray.current,
    sortingBy: sortingBy.current,
    sortingTypes,
    selectedSortType: selectedSortTypeRef.current.toString(),
    error,
    isLoading,
  };
};

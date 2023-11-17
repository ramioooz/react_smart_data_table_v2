import React, { useContext, useEffect, useState, useRef } from "react";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { Button, Input, Skeleton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import ClearIcon from "@mui/icons-material/Clear";
import TableDataSkelaton from "../../components/TableRowsSkelaton";
import axios from "axios";
import "./style.css";
import {
  TableDataContext,
  context_action_enum,
} from "../../context/TableDataContext";
import { useTable } from "../../hooks/useTable";
import { stylesType, tableInputType } from "../../utils/types";
import { values } from "../../constants";

const TablePage = ({
  title,
  dataSourceUrl,
  columns_to_display,
}: tableInputType) => {
  const recordsPerPage_list = [5, 10, 20, 50];
  const recordsPerPage = useRef(recordsPerPage_list[0]); // initial value

  const [searchTerm, setSearchTerm] = useState("");

  // const styles = {
  //   btn: 'border border-gray-400 px-3 hover:bg-astudio-Yellow'
  // }

  const { state, dispatch } = useContext(TableDataContext);

  const {
    initTableFn,
    nextPageFn,
    previousPageFn,
    goToPageFn,
    sortFn,
    currentPageNum,
    numbersArray,
    sortingBy,
    sortingTypes,
    selectedSortType,
    error,
    isLoading,
  } = useTable({ dataSourceUrl, columns_to_display });

  const [initFnRunning, setInitFnRunning] = useState(true);

  const initFn = async () => {
    if (!initFnRunning) {
      setInitFnRunning(true);
    }
    await initTableFn(recordsPerPage.current);
    const updatedSearchTerm = "";
    setSearchTerm(updatedSearchTerm);
    setInitFnRunning(false);
  };

  useEffect(() => {
    initFn();
  }, []);

  return (
    <div style={styles.main}>
      <div style={styles.body}>
        
        <h1 style={styles.title}>{title}</h1>

        <div style={styles.topBtns}>
          <div style={styles.topBtns_style}>
            <p>Records/Page:</p>
            <Dropdown>
              <MenuButton
                size="sm"
                disabled={initFnRunning || isLoading || error ? true : false}
              >
                {recordsPerPage.current}
              </MenuButton>
              <Menu size="sm">
                {recordsPerPage_list.map((rpp, i) => (
                  <MenuItem
                    key={i}
                    onClick={async () => {
                      // setRecordsPerPage(rpp);
                      recordsPerPage.current = rpp;
                      await initFn();
                    }}
                  >
                    {rpp}
                  </MenuItem>
                ))}
              </Menu>
            </Dropdown>
          </div>
          <div style={styles.topBtns_style}>
            <p>Search Records:</p>
            <Input
              size="sm"
              placeholder="Enter keywords…"
              startDecorator={<SearchIcon />}
              endDecorator={
                searchTerm.length > 0 && (
                  <ClearIcon
                    onClick={() => {
                      // console.log('clearing search..');
                      const updatedSearchTerm = "";
                      setSearchTerm(updatedSearchTerm);
                      dispatch({
                        type: context_action_enum.TABLE_SEARCH_RECORDS,
                        payload: { searchTerm: updatedSearchTerm },
                      });
                      // and apply existing sorting criteria
                      dispatch({
                        type: context_action_enum.TABLE_SORT_RECORDS,
                        payload: {
                          sortBy: sortingBy,
                          sortType: selectedSortType,
                        },
                      });
                    }}
                  />
                )
              }
              value={searchTerm}
              onChange={(event) => {
                const updatedSearchTerm = event.target.value.toString();
                // console.log('updated searchTerm: ', updatedSearchTerm);
                setSearchTerm(updatedSearchTerm);
                dispatch({
                  type: context_action_enum.TABLE_SEARCH_RECORDS,
                  payload: { searchTerm: updatedSearchTerm.trim() },
                });
                // and apply existing sorting criteria
                dispatch({
                  type: context_action_enum.TABLE_SORT_RECORDS,
                  payload: {
                    sortBy: sortingBy,
                    sortType: selectedSortType,
                  },
                });
              }}
              disabled={initFnRunning || isLoading || error ? true : false}
            />
          </div>
          <div style={styles.topBtns_style}>
            <p>Sorting By:</p>
            <Dropdown>
              <MenuButton
                size="sm"
                disabled={initFnRunning || isLoading || error ? true : false}
              >
                {error ? "Table error" : sortingBy.toUpperCase() || "loading.."}
              </MenuButton>
              {!initFnRunning && !isLoading && (
                <Menu size="sm">
                  {columns_to_display.map((sKey, i) => (
                    <MenuItem
                      key={i}
                      onClick={() => {
                        sortFn(sKey);
                      }}
                    >
                      {sKey.toUpperCase()}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Dropdown>
            <Button
              color="neutral"
              onClick={() => {
                const desiredSortingType =
                  selectedSortType == sortingTypes[0]
                    ? sortingTypes[1]
                    : sortingTypes[0];
                sortFn(sortingBy, desiredSortingType);
              }}
              size="sm"
              variant="outlined"
              disabled={initFnRunning || isLoading || error ? true : false}
            >
              {selectedSortType.toUpperCase()}
              {selectedSortType.toUpperCase() == sortingTypes[0] ? (
                <NorthIcon fontSize="small" className="scale-75" />
              ) : (
                <SouthIcon fontSize="small" className="scale-75" />
              )}
            </Button>
          </div>
        </div>

        <div style={styles.tableCont}>
          <table style={{borderCollapse: "collapse"}}>
            <thead>
              <tr>
                {columns_to_display.map((col, i) => (
                  <th key={i} style={styles.tableHeader}>
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody >
              {/* {(isLoading) ? } */}

              {isLoading ? (
                <TableDataSkelaton
                  colsNum={columns_to_display.length}
                  rowsNum={recordsPerPage.current}
                  stl={{
                    padding: "8px 12px",
                    borderBottomWidth: "2px",
                    borderRightWidth: "2px",
                  }}
                />
              ) : error != null ? (
                <tr>
                  <td style={{ padding: "4px 12px" }}>{error}</td>
                </tr>
              ) : state && state.displayRecords.length > 0 ? (
                state.displayRecords.map((d: { [key: string]: string }, i) => (
                  <tr
                    key={i}
                    // style={styles.tableRow}
                    className="tableRow"
                  >
                    {columns_to_display.map((col: string, i) => {
                      var foundK =
                        Object.keys(d).find((k: string) => k == col) || "";
                      return (
                        <th key={i} style={styles.tableCell}>
                          {d[foundK]}
                        </th>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  {/* <div>No koko</div> */}
                  <td style={{ padding: "4px 12px" }}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>

          {isLoading ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={200}
              height={25}
            />
          ) : (
            // ((error == null) && state && state.displayRecords.length < 1 && )
            error == null && (
              <ul style={styles.paginationCont}>
                <a
                  href="#"
                  onClick={async () => {
                    await previousPageFn(recordsPerPage.current);
                    const updatedSearchTerm = "";
                    setSearchTerm(updatedSearchTerm);
                  }}
                  className="paginationBtn"
                >
                  Prev
                </a>
                <div
                  style={styles.paginationBtnsCont}
                >
                  {numbersArray.map((pageNum, i) => (
                    <a
                      key={i}
                      href="#"
                      onClick={async () => {
                        await goToPageFn(recordsPerPage.current, pageNum);
                        const updatedSearchTerm = "";
                        setSearchTerm(updatedSearchTerm);
                      }}
                      // className={`${styles.btn} ${
                      //   currentPageNum == pageNum ? "bg-astudio-Yellow" : ""
                      // }`}
                      className={`paginationBtn ${(currentPageNum == pageNum) && 'btnSelected'}`}
                    >
                      {pageNum}
                    </a>
                  ))}
                </div>
                <a
                  href="#"
                  onClick={async () => {
                    await nextPageFn(recordsPerPage.current);
                    const updatedSearchTerm = "";
                    setSearchTerm(updatedSearchTerm);
                  }}
                  // className={`${styles.btn} ${currentPageNum == pageNum ? 'bg-astudio-Yellow' : ''}`}
                  // style={(currentPageNum == pageNum) ? styles.paginationBtnSelected: styles.paginationBtn}
                  // className="btnSelected"
                  // style={{background: "yellow"}}
                  className="paginationBtn"
                >
                  Next
                </a>
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

var marg =
  parseFloat(values.header_height.replace(/\D/g, "")) +
  parseFloat(values.footer_height.replace(/\D/g, "")) +
  "px";
// console.log('marg: ', marg);
const styles: stylesType = {
  main: {
    minHeight: `calc(100vh - ${marg})`,
  },
  body: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    // border: "2px gray solid",
    alignItems: "start",
    overflowX: "auto"
  },
  title: {
    // mb-3 text-3xl font-bold
    marginBottom: "12px",
    fontSize: "26px",
    fontWeight: "bold",
  },
  topBtns: {
    // flex flex-wrap gap-x-5 gap-y-2 mb-5
    display: "flex",
    flexWrap: "wrap",
    gap: "5px 20px",
    marginBottom: "24px",
  },
  topBtns_style: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  tableCont: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    
  },
  tableHeader: {
    // className="px-3 py-1 border-b-2 border-r-2 border-astudio-Grey"
    padding: "4px 12px",
    border: "2px solid gray",
    background: "#b8e0ff",
  },
  tableCell: {
    // borderBottom: "2px solid #bababa",
    // borderRight: "2px solid #bababa",
    border: "2px gray solid",
  },
  paginationCont: {
    // flex gap-2 items-center
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  paginationBtnsCont: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

export default TablePage;

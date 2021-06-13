import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listProducts } from "../../graphql/queries";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  CardMedia,
} from "@material-ui/core";
import useTable from "./useTable";
//import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "./Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";
import Admin from "../Admin";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  head: {
    backgroundColor: "#506AD4",
    color: theme.palette.common.white,
  },
}));

const headCells = [
  { id: "title", label: "Title" },
  { id: "category", label: "Category" },
  { id: "description", label: "Description" },
  { id: "image", label: "Image" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
  // Added
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      // setLoading(true);
      // Switch authMode to API_KEY for public access
      const { data } = await API.graphql({
        query: listProducts,
      });
      const products = data.listProducts.items;
      console.log("red", products);

      // const featured = books.filter((book) => {
      //   return !!book.featured;
      // });
      setRecords(products);
      // setFeatured(featured);
      //setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([
    { id: 1, title: "hdhdhhdh" },
    { id: 2, title: "ddhdhdh" },
  ]);
  //console.log("red" + records);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  // Added

  // const addOrEdit = (employee, resetForm) => {
  //   if (products.id == 0) employeeService.insertEmployee(employee);
  //   else employeeService.updateEmployee(employee);
  //   resetForm();
  //   setRecordForEdit(null);
  //   setOpenPopup(false);
  //   setRecords(employeeService.getAllEmployees());
  //   setNotify({
  //     isOpen: true,
  //     message: "Submitted Successfully",
  //     type: "success",
  //   });
  // };

  const openInPopup = (item) => {
    //setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    // employeeService.deleteEmployee(id);
    // setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <AmplifyAuthenticator>
      <>
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="Search Employees"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
            <Controls.Button
              text="Add New"
              variant="outlined"
              startIcon={<AddIcon />}
              className={classes.newButton}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />
          </Toolbar>
          <TblContainer>
            <TblHead className={useStyles.head} />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                  {/* <TableCell>
                  <CardMedia
                    component="img"
                    alt="image"
                    height="140"
                    image={item.image}
                    title="image"
                  />
                  {item.createdAt}
                </TableCell> */}
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this record?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(item.id);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
        <Popup
          title="Product Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <Admin />
        </Popup>
        <Notification notify={notify} setNotify={setNotify} />
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </>
    </AmplifyAuthenticator>
  );
}

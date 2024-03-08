import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Table, TableHead, TableBody, TableCell, TableRow, tableCellClasses, TableContainer, TableFooter, TablePagination, Grid, ButtonBase, Typography, CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import { NFTDetails, PointInfo, Price } from './types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  '& .image': {
    width: "70px",
    height: "70px"
  },
  '& .detailImage': {
    width: "150px",
    height: "150px",
  }
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function CustomizedTableRow(props: { row: NFTDetails}) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow hover>
          <StyledTableCell style={{ width: 100 }} component="th" scope="row">
          <img className="image" src={row.image} alt={String(row.tokenId)}/>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.name}
        </StyledTableCell>
        <StyledTableCell style={{ width: 120 }} align="right">
          {row.tokenId}
        </StyledTableCell>
        <StyledTableCell style={{ width: 120 }} align="right">
          {row.price}
        </StyledTableCell>
        <StyledTableCell style={{ width: 160, paddingRight: 30 }} align="right">
          {row.pointNFT}
        </StyledTableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={()=>setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit> 
            <Box sx={{padding: "10px"}}>
              <Grid container spacing={4}>
                <Grid item>
                  <ButtonBase>
                    <img className="detailImage" alt="complex" src={row.image} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs={8} container direction="column" spacing={2}>
                    <Grid item>
                      <Typography gutterBottom variant="subtitle1" component="h2">Traits</Typography>
                    </Grid>
                    <Grid item>
                      <Typography gutterBottom variant="subtitle1" component="h2">
                        Tier: {row.tier}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Type: {row.type}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Resort: {row.resort}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

async function fetchData(NFTs: Price[]):Promise<NFTDetails[]> {
  let allNFTs: NFTDetails[] = [];
  const baseURL = 'https://corsproxy.io/?https://genesis-api.keungz.com/ygpz/info/';
  const url = NFTs.map((nft:Price) => nft.tokenId).join(",");
  try {
    const response = await axios.get(`${baseURL}${url}`);
    let rawData = {...response.data};
    let pointNFTs: PointInfo[] = Object.values(rawData.pointInfo);
    allNFTs = Object.values(rawData.metadata).map((metaInfo: any, index:number) => ({
      tokenId: metaInfo.tokenId,
      name: metaInfo.name,
      image: metaInfo.image,
      pointNFT: pointNFTs[index].pointNFT,
      tier: metaInfo.attributes[0]?.value,
      type: metaInfo.attributes[1]?.value,
      resort: metaInfo.attributes[2]?.value,
      price: NFTs.find((nft)=>(Number(nft.tokenId) === metaInfo.tokenId))?.price.amount
    }))
    return allNFTs;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setDate] = React.useState<NFTDetails[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {    
    const fetchAllNFTData = async () => {
      setLoading(true);
      let allNFTs:NFTDetails[] = [];
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/fetch-data`);
      const NFTs = response.data;
      allNFTs = await fetchData(NFTs.nftPrices);
      setDate(allNFTs.sort((a,b)=>(a.pointNFT>b.pointNFT ? -1 : 1)));
      setLoading(false);
    }

    fetchAllNFTData();
  }, []);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {loading && (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              )}
            </StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Token Id</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell style={{ paddingRight: 30 }} align="right">PointNFT</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data && data.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row: any) => (
          // Use a unique value for key, such as the token ID if it's unique
          <CustomizedTableRow key={row.tokenId} row={row} />
        ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
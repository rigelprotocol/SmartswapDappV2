import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, useColorModeValue, Spinner } from '@chakra-ui/react';
import { CloseIcon, AddIcon, RemoveIcon } from '../../../../theme/components/Icons';
import { removeSideTab, checkSideTab } from '../../../../utils/utilsFunctions';
import TransactionHistory from './TransactionHistory';
import useAccountHistory from "../../../../utils/hooks/useAccountHistory";
import useMarketHistory from "../../../../utils/hooks/useMarketHistory";
import { DataType } from "./TransactionHistory";
import MarketHistory from "./MarketHistory";
import { transactionTab,refreshTransactionTab } from "../../../../state/transaction/actions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../state";
import ConfirmationModal from '../../../../components/Modals/confirmationModal';
import { TrxState, setOpenModal } from '../../../../state/application/reducer';


const History = () => {

  const activeTabColor = useColorModeValue('#333333', '#F1F5F8');
  const nonActiveTabColor = useColorModeValue('#CCCCCC', '#4A739B');
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');
  const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
  const [data, setData] = useState<DataType | null>(null)
  const [showModal, setShowModal] = useState(false)

  // const [sideBarRemoved, setSideBarRemoved] = useState<Boolean>(false);

  const [show, setShow] = useState<Boolean>(false);
  const [showMarketHistory, setShowMarketHistory] = useState(false);

  const sideBarRemoved = useSelector((state: RootState) => state.transactions.removeSideTab);

  const { historyData, loading, locationData } = useAccountHistory();
  const { marketHistoryData, loadMarketData } = useMarketHistory();

  const userData = Object.keys(historyData).map((i) => historyData[i]);
  const historyArray = Object.keys(marketHistoryData).map((i) => marketHistoryData[i]);

  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    // setURL("http://localhost:7000")
    const isActive = checkSideTab('history');
    dispatch(transactionTab({ removeSideTab: isActive }))

  }, []);

  const deleteDataFromDatabase = async () => {
    if (data && data.name === "Auto Time") {
      setOpenModal({
        message: "Deleting Transaction...",
        trxState: TrxState.WaitingForConfirmation,
      })
      const result = await fetch(`${URL}/auto/data/${data.id}`, { method: 'DELETE' })
      const res = await result.json()
      if (res === "success") {
        dispatch(
          setOpenModal({
            message: `Data deleted Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
      }
      dispatch(refreshTransactionTab({ refresh:Math.random() }))
    } else if (data && data.name === "Set Price") {
      setOpenModal({
        message: data.status === 2 ? "Suspending Transaction..." : "Resuming Transaction",
        trxState: TrxState.WaitingForConfirmation,
      })
      const result = await fetch(`${URL}/auto/update/${data.id}`, {
        mode: "cors",
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "PUT",
        body: data.status === 2 ? JSON.stringify({ status: 3 }) : JSON.stringify({ status: 2 })
      })
      const res = await result.json()
      if (res === "success") {
        dispatch(
          setOpenModal({
            message: `Data deleted Successful.`,
            trxState: TrxState.TransactionSuccessful,
          })
        );
      }
      dispatch(refreshTransactionTab({ refresh:Math.random() }))
    }
    setShowModal(false)
  }
  const confirmDeletion = async (data: DataType) => {
    setData(data)
    setShowModal(true)
  }

  return (
    <Flex
      border="1px"
      borderColor={borderColor}
      borderRadius="6px"
      display={sideBarRemoved && "none"}
      alignItems="center"

    >
      <Box w="100%" pl={3} my={4} pr={3}>
        <Flex alignItems="center" justifyContent="space-between" px={4}>
          <Flex>
            <Text
              fontWeight="400"
              mr={3}
              fontSize="16px"
              className='History'
              color={!showMarketHistory ? activeTabColor : nonActiveTabColor}
              cursor="pointer"
              onClick={() => {
                setShowMarketHistory(false);
              }}
            >
              {locationData==="swap" ?"Transaction History" : "Open Orders"}
            </Text>
            <Text fontWeight="400" cursor="pointer" fontSize="16px" color={showMarketHistory ? activeTabColor : nonActiveTabColor} onClick={() => {
              setShowMarketHistory(true);
            }}>
              Market History
            </Text>
          </Flex>
          <Flex alignItems="center" fontWeight="bold" rounded={100} bg="#">
            {show ? (<Flex
              border="2px"
              alignItems="center"
              justifyContent="center"
              mr={2}
              color={iconColor}
              borderColor={iconColor}
              w="22px"
              h="22px"
              borderRadius="6px"
              onClick={() => {
                setShow(false);
              }}
            >
              <RemoveIcon />

            </Flex>) : (<Flex
              border="2px"
              alignItems="center"
              justifyContent="center"
              mr={2}
              color={iconColor}
              borderColor={iconColor}
              w="22px"
              h="22px"
              borderRadius="6px"
              onClick={() => {
                setShow(true);
              }}
            >
              <AddIcon onClick={() => setShow(true)} />


            </Flex>)}
            <Flex
              border="2px"
              alignItems="center"
              justifyContent="center"
              color={iconColor}
              borderColor={iconColor}
              w="22px"
              h="22px"
              borderRadius="6px"
              cursor="pointer"
              onClick={() => {
                dispatch(transactionTab({ removeSideTab: true }));
                removeSideTab('history');
              }}
            >
              <CloseIcon />
            </Flex>
          </Flex>
        </Flex>

      </Box>
      <Box
        overflowY={'scroll'}
        maxHeight={'80vh'}
      >
        <Flex justifyContent={'center'}>
          {show && loadMarketData || show && loading && <Spinner my={3} size={'md'} />}
        </Flex>

        {show && showMarketHistory && marketHistoryData && historyArray.map((data: DataType,index) => (
          <MarketHistory key={index} data={data} />
        ))}

        {show && !showMarketHistory && historyData && userData.map((data: DataType, index) => (
          <TransactionHistory key={index} data={data} deleteData={confirmDeletion} />
        ))}
      </Box>
      <ConfirmationModal
        showModal={showModal}
        setShowModal={setShowModal}
        deleteDataFromDatabase={deleteDataFromDatabase}
        text={`You are about to ${data?.frequency === "price" && data?.status===3 ? "resume" : data?.frequency === "price" && data?.status===2 ? "suspend" : "delete"} an ${data?.name} transaction. This will prevent future transaction from been auto enabled for you. Do you want to continue`}
      />
    </Flex>
  );
};
export default History;
import React,{ useState,useCallback } from "react"
import {
    ModalOverlay,
    ModalContent,
    Modal, 
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    useDisclosure,
    useColorModeValue,
    Flex,
    Text,
    Button,
    Image,
    Box,
    Link
} from "@chakra-ui/react"
import { useAddUserToken } from "../../state/user/hooks";
import { ArrowBackIcon } from "@chakra-ui/icons"
import Warning from '../../assets/warning.svg'; 
import LightWarning from '../../assets/lightWarning.svg'; 
import ListLogo from "../Logo/ListLogo";
import { TokenList } from "@uniswap/token-lists";
import useFetchListCallback from "../../utils/hooks/useFetchListCallback";
import { useDispatch } from "react-redux";
import { useAllLists } from "../../state/lists/hooks";
import {enableList,removeList} from "../../state/lists/actions"


interface ImportProps {
    listURL: string
    list: TokenList
   closeModal: () => void,
    open:boolean
  }
  
const ImportList:React.FC<ImportProps> = ({
  listURL,
    list,
    closeModal,
    open}) => {

  const addToken = useAddUserToken()

    const bgColor = useColorModeValue("#FFF", "#15202B");
    const boxShadow= useColorModeValue('#DEE6ED', '#324D68');
    const lightTextColor = useColorModeValue("#666666", "#DCE6EF");
    const heavyTextColor = useColorModeValue("#333333", "#F1F5F8");
    const textColor = useColorModeValue("#319EF6","#4CAFFF")
    const boxColor = useColorModeValue("#F2F5F8","#213345")
    const WarningLogo = useColorModeValue(LightWarning,Warning)
    const {
        onClose,
      } = useDisclosure();
      const dispatch = useDispatch()
      const [addError, setAddError] = useState<string | null>(null)
      const lists = useAllLists()
      const fetchList = useFetchListCallback()
      const adding = Boolean(lists[listURL]?.loadingRequestId)

      const handleAddList = useCallback(()=>{
        if (adding) return
        setAddError(null)
        fetchList(listURL)
        .then(() => {
          dispatch(enableList(listURL))
          closeModal()
        })
        .catch((error) => {
          setAddError(error.message)
          dispatch(removeList(listURL))
        })
      },[])
    return (
        
        <>
        <Modal isOpen={open} onClose={closeModal} isCentered >
            <ModalOverlay />
            <ModalContent
                width="95vw"
                borderRadius="6px"
                bgColor={bgColor}
            >
                 <ModalCloseButton
                  bg="none"
                  size={'sm'}
                  mt={3}
                  mr={3}
                  cursor="pointer"
                  _focus={{ outline: 'none' }}
                  onClick={closeModal}
                  p={'7px'}
                  border='1px solid'
              />
          <ModalHeader color={heavyTextColor} fontWeight="500"
         boxShadow={`0px 1px 0px ${boxShadow}`}>
            <ArrowBackIcon
              w={10}
              h={6}
              cursor="pointer"
              marginLeft="-12px"
              onClick={closeModal}
            />
            <Flex
              flexDirection="row"
              justifyContent="space-evenly"
              marginTop="-49px"
            >
              <Text marginLeft="0px" marginTop="22px" fontSize="16px">
                Import List
              </Text>
            </Flex>
          </ModalHeader>
                <ModalBody pb="30px">
                  <Flex justifyContent="center" py="30px" alignItems="center" flexDirection="column">
                  <Image src={WarningLogo}  pb="20px"/> 
                  <Text textAlign="center" color={heavyTextColor}>
                  By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.
                          </Text>
                    </Flex>
                
                     
               
                 <Flex 
  justifyContent="space-between"
  p="2"
  py="4"
  bgColor={boxColor}
  border={`1px solid borderColor2`}
  borderRadius="6px"
  my="4">      
      <Box mt="2" mr="3">
        {list.logoURI ? (
                <ListLogo size="60px"squared logoURI={list.logoURI} alt={`${list.name} list logo`} />
                ) : (
                <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
        )}
      </Box>
        
        <Flex width="80%">
          <Box mt="2">
              <Flex>
 <Text color={heavyTextColor} fontWeight="700" 
                fontSize="20px" mr="3">{list.name}
              </Text><span style={{marginTop:"2px"}}>•</span>
                  <Text color={lightTextColor} 
             fontSize="12px" ml="3" mt="1.5">{list.tokens.length} Tokens</Text>
                  </Flex>
             <Box mt="2">
             <Link cursor="pointer" color="teal.500"  href={`https://tokenlists.org/token-list?url=${listURL}`} isExternal isTruncated fontSize="13px">
               {listURL}
             </Link>
             </Box>
          </Box>
                 
        </Flex> 
                 
                        
  </Flex> 
                <Button color="white" bgColor={textColor} isFullWidth mt="3" height="48px"
                onClick={handleAddList}
                > Import</Button>
                      </ModalBody>
            </ModalContent>
          </Modal>
          </>
    )
}

export default ImportList

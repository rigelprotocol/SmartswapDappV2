import React from "react";
import {
    Box, Button,
    Flex,
    Menu,
    MenuButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";

const TableItem = () => {
    return (
        <>
            <Box>
                <Flex justifyContent={'space-between'} alignItems={'center'} m={'20px 0'}>
                    <Text>Showing 10 of 50 results</Text>
                    <Menu>
                        <MenuButton
                            mr={1}
                            variant="ghost"
                            as={Button}
                            transition="all 0.2s"
                            borderRadius="md"
                            borderWidth="1px"
                            _hover={{ bg: "gray.100" }}
                            _focus={{ boxShadow: "outline" }}
                            rightIcon={<ChevronDownIcon />}
                            fontSize="14px"
                            className='HeaderDApps'
                        >
                            Filter
                        </MenuButton>
                    </Menu>
                </Flex>
                <Box border={'1px solid #E1E7EA'}>
                    <TableContainer>
                        <Table>
                            <Thead bg={'#F6F8F9'} fontSize={'16px'} textAlign={'center'}>
                                <Tr color={'#A7A9BE'}>
                                    <Th>EVENT#</Th>
                                    <Th>YOUR BID</Th>
                                    <Th>DATE & TIME</Th>
                                    <Th textAlign={'center'}>STATUS</Th>
                                    <Th>ACTION</Th>
                                </Tr>
                            </Thead>
                            <Tbody fontSize={'16px'} textAlign={'center'}>
                                <Tr>
                                    <Td>#172344</Td>
                                    <Td>5.5 RGP</Td>
                                    <Td>Apr. 30, 2021 | 12:21 pm</Td>
                                    <Td textAlign={'center'} color={'#EA6739'}>00 : 32 : 14</Td>
                                    <Td color={'#7F5AF0'}>View Event</Td>
                                </Tr>
                                <Tr>
                                    <Td>#172344</Td>
                                    <Td>6 RGP</Td>
                                    <Td>Apr. 30, 2021 | 12:21 pm</Td>
                                    <Td alignItems={'start'}>
                                        <Box width={'100%'} textAlign={'center'} background={'#DAFFF0'} borderRadius={'50px'} p={2}>
                                            <Text color={'#2CB67D'} fontSize={'14px'}>Congratulations!</Text>
                                        </Box>
                                    </Td>
                                    <Td color={'#7F5AF0'}>View Event</Td>
                                </Tr>
                                <Tr>
                                    <Td>#192366</Td>
                                    <Td>8 RGP</Td>
                                    <Td>Apr. 30, 2021 | 12:21 pm</Td>
                                    <Td alignItems={'start'}>
                                        <Box width={'100%'} textAlign={'center'} background={'#E8F3FF'} borderRadius={'50px'} p={2}>
                                            <Text color={'#0967D2'} fontSize={'14px'}>Wow! You got 10%</Text>
                                        </Box>
                                    </Td>
                                    <Td color={'#7F5AF0'}>View Event</Td>
                                </Tr>
                            </Tbody>
                            <Tfoot>
                                <Tr></Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    )
};

export default TableItem;
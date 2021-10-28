import { Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiCopy } from 'react-icons/fi'
import {BiMinus} from 'react-icons/bi';
import { IoMdClose, IoMdAdd , IoMdArrowForward, IoMdRemove} from 'react-icons/io';
import { RiErrorWarningLine } from 'react-icons/ri';
import { BsExclamationCircle } from "react-icons/bs";
import {BiPen} from 'react-icons/bi';

export const SwitchIcon = () => {
  const arrowColor = useColorModeValue('#333333', '#F1F5F8');
  const switchBgcolor = useColorModeValue('#F2F5F8', '#213345');
  const borderColor = useColorModeValue('#DEE5ED', '#324D68');

  return (
    <Icon
      as={CgArrowsExchangeAltV}
      color={arrowColor}
      p={1}
      borderRadius="6px"
      border="2px"
      borderColor={borderColor}
      bgColor={switchBgcolor}
      h="35px"
      w="35px"
    />
  );
};

export const SettingsIcon = () => {
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  return (
    <Icon
      as={IoSettingsOutline}
      w="32px"
      color={iconColor}
      padding="4px"
      h="32px"
      mr={2}
    />
  );
};
export const CopyIcon = () => {
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  return (
    <Icon
      as={FiCopy}
      w="28px"
      color={iconColor}
      h="28px"
      mr={4}
      mt={1.5}
      />
      );
    };
export const WarningIcon = ({color}:any) => {
  return (
    <Icon
      as={RiErrorWarningLine}
      w="32px"
      color={color}
      padding="4px"
      h="32px"
      mr={2}
    />
  );
};

export const CloseIcon = () => {
  return <Icon as={IoMdClose} h="18px" w="18px" />;
};

export const AddIcon = ({ onClick }: {onClick: Function}) => {
  return <Icon as={IoMdAdd} h="18px" w="18px" cursor={'pointer'} onClick={() => onClick()} />;
};

export const SubtractIcon = ({ onClick }: {onClick: Function}) => {
  return <Icon as={BiMinus} h={'18px'} w={'18px'} cursor={'pointer'} onClick={() => onClick()}/>
};

export const ArrowRightIcon = () => {
  return <Icon as={IoMdArrowForward} h="18px" w="18px" />;
};

export const RemoveIcon = () => {
  return <Icon as={IoMdRemove} h="18px" w="18px" />;
};

export const VectorIcon = () => {
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  return (
    <Icon
      as={BiPen}
      w="15px"
      color={iconColor}
      h="15px"
    />
  );
};
export const ExclamationIcon = () => {
  const iconColor = useColorModeValue('#666666', '#DCE5EF');
  return (
    <Icon
      as={BsExclamationCircle}
      w="16px"
      color={iconColor}
      h="16px"
    />
  );
};
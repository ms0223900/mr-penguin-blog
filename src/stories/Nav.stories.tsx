import { ComponentMeta, ComponentStory } from '@storybook/react';
import NavItem from 'components/Nav/NavItem';
import NavList from 'components/Nav/NavList';
import Header from 'components/NewHeader/Header';
import IconMenuIcon from 'components/Nav/IconMenuBook.svg';
import 'styles/globals.scss';

export default {
  title: 'Header/Nav',
  component: NavItem,
} as ComponentMeta<any>;

const NavTemp: ComponentStory<typeof NavItem> = (args) => <NavItem {...args} />;

export const NavWithIcon = NavTemp.bind({});
NavWithIcon.args = {
  icon: <IconMenuIcon fill={'rgb(47, 68, 165)'} />,
  title: '愛讀書',
  link: '/posts-page/books',
};

const NavListTemp: ComponentStory<typeof NavList> = (args: any) => (
  <NavList {...args} />
);

export const navList = NavListTemp.bind({});

const HeaderTemp: ComponentStory<typeof Header> = (args: any) => (
  <Header {...args} />
);

export const header = HeaderTemp.bind({});

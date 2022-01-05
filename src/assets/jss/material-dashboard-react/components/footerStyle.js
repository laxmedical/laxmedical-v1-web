import { defaultFont, container, primaryColor, grayColor } from 'assets/jss/material-dashboard-react.js';

const footerStyle = {
  block: {
    color: 'inherit',
    textTransform: 'uppercase',
    borderRadius: '3px',
    textDecoration: 'none',
    display: 'block',
    ...defaultFont,
    fontWeight: '500',
    fontSize: '12px'
  },
  right: {
    padding: '5px 10px ',
    margin: '0',
    fontSize: '14px',
    textAlign: 'right'
  },
  footer: {
    bottom: '0',
    borderTop: '1px solid #ccc',
    padding: '5px 0',
    ...defaultFont
  },
  container,
  a: {
    color: primaryColor,
    textDecoration: 'none',
    backgroundColor: 'transparent'
  },
  list: {
    marginBottom: '0',
    padding: '0',
    marginTop: '0'
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto'
  }
};
export default footerStyle;

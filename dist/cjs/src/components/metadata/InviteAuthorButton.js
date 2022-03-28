"use strict";
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const InviteAuthorPopperContainer_1 = __importDefault(require("./InviteAuthorPopperContainer"));
const Button = styled_components_1.default(style_guide_1.TextButton) `
  margin-left: ${(props) => props.theme.grid.unit * 3}px;
`;
class InviteAuthorButton extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
        };
        this.togglePopper = () => {
            this.updateListener(!this.state.isOpen);
            this.setState({
                isOpen: !this.state.isOpen,
            });
        };
        this.handleClickOutside = (event) => {
            if (this.node && !this.node.contains(event.target)) {
                this.togglePopper();
            }
        };
        this.updateListener = (isOpen) => {
            if (isOpen) {
                document.addEventListener('mousedown', this.handleClickOutside);
            }
            else {
                document.removeEventListener('mousedown', this.handleClickOutside);
            }
        };
    }
    componentDidMount() {
        this.updateListener(this.state.isOpen);
    }
    render() {
        const { isOpen } = this.state;
        return (react_1.default.createElement(react_popper_1.Manager, null,
            react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(Button, { ref: ref, onClick: this.togglePopper }, "Invite as Collaborator"))),
            isOpen && (react_1.default.createElement(react_popper_1.Popper, { placement: 'bottom', innerRef: (node) => (this.node = node) }, (popperProps) => (react_1.default.createElement(InviteAuthorPopperContainer_1.default, { popperProps: popperProps, project: this.props.project, author: this.props.author, updateAuthor: this.props.updateAuthor, tokenActions: this.props.tokenActions }))))));
    }
}
exports.default = InviteAuthorButton;
//# sourceMappingURL=InviteAuthorButton.js.map
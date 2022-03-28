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
exports.AccountFooter = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Container = styled_components_1.default.div `
  position: fixed;
  bottom: ${(props) => props.theme.grid.unit * 4}px;
  left: ${(props) => props.theme.grid.unit * 4}px;
`;
const HeavyLink = styled_components_1.default.a `
  color: inherit;
  font-weight: ${(props) => props.theme.font.weight.medium};
  text-decoration: none;
`;
const AccountFooter = () => (react_1.default.createElement(Container, null,
    react_1.default.createElement("div", null, "Copyright \u00A9 2019 Atypon Systems, LLC."),
    react_1.default.createElement(HeavyLink, { href: 'https://www.atypon.com/privacy-policy/' }, "Privacy policy")));
exports.AccountFooter = AccountFooter;
//# sourceMappingURL=AccountFooter.js.map
# PTIT Blockchain — Smart Contract & Web3

Dự án thực hành môn Blockchain tại PTIT, gồm hai phần: phát triển Smart Contract bằng Solidity và xây dựng ứng dụng Web3 tương tác với blockchain Ethereum.

## 1. Giới thiệu

Dự án sử dụng mạng thử nghiệm Ethereum Sepolia để triển khai và tương tác với Smart Contract.

- **Bài 1:** Xây dựng, biên dịch, triển khai và tương tác với Smart Contract bằng Remix IDE và Hardhat.
- **Bài 2:** Xây dựng ứng dụng DAO (Decentralized Autonomous Organization) bằng React, Web3.js và MetaMask.

## 2. Công nghệ sử dụng

| Công nghệ        | Vai trò                                           |
| ---------------- | ------------------------------------------------- |
| Solidity         | Ngôn ngữ lập trình Smart Contract                 |
| Remix IDE        | Biên dịch và tương tác với Smart Contract         |
| Hardhat          | Phát triển, kiểm thử và triển khai Smart Contract |
| Ethereum Sepolia | Mạng blockchain thử nghiệm                        |
| React + Vite     | Xây dựng giao diện Web3                           |
| Web3.js          | Kết nối ứng dụng với Smart Contract               |
| MetaMask         | Kết nối ví và ký giao dịch                        |
| Tailwind CSS     | Thiết kế giao diện                                |

## 3. Cấu trúc dự án

```text
Blockchain-PTIT/
├── hardhat-project/
│   ├── contracts/
│   │   ├── FirstSmartContract.sol
│   │   └── DominionDAO.sol
│   ├── scripts/
│   ├── hardhat.config.js
│   └── package.json
│
├── dominion-dao-frontend/
│   ├── src/
│   │   ├── abi/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── Blockchain.services.jsx
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 4. Bài 1 — Smart Contract

### FirstSmartContract

Smart Contract gồm hai chức năng:

- `setBalance(uint256 x)`: Ghi giá trị vào blockchain.
- `getBalance()`: Đọc giá trị đã lưu.

Kết quả thực hành:

1. Biên dịch Smart Contract bằng Remix.
2. Triển khai hợp đồng lên Sepolia bằng Hardhat.
3. Gọi `setBalance(500000000)` bằng Hardhat.
4. Kết nối lại hợp đồng bằng Remix.
5. Gọi `getBalance()` và nhận được `500000000`.
6. Gọi `setBalance(123456789)` bằng Remix.
7. Gọi `getBalance()` và nhận được `123456789`.

**Contract Address:**

`0x4B63a0dB480cb735d92b309E03af3209Ed7Db8c9`

[Kiểm tra trên Sepolia Etherscan](https://sepolia.etherscan.io/address/0x4B63a0dB480cb735d92b309E03af3209Ed7Db8c9)

### DominionDAO

Triển khai Smart Contract quản trị DAO trên Sepolia để phục vụ ứng dụng Web3.

**Contract Address:**

`0x7868106024464071523837a325F2447b3c8E064B`

[Kiểm tra trên Sepolia Etherscan](https://sepolia.etherscan.io/address/0x7868106024464071523837a325F2447b3c8E064B)

## 5. Bài 2 — React Web3 DAO

Ứng dụng PTIT Dominion cho phép người dùng kết nối ví và tương tác với Smart Contract.

### Các chức năng đã kiểm thử

- Kết nối MetaMask với Ethereum Sepolia.
- Đọc số dư quỹ DAO.
- Đóng góp SepoliaETH vào quỹ DAO.
- Kiểm tra trạng thái Stakeholder.
- Tạo đề xuất chi tiền từ quỹ DAO.
- Hiển thị danh sách và trang chi tiết đề xuất.

### Các chức năng cần tiếp tục kiểm thử

- Vote: Bỏ phiếu chấp thuận hoặc phản đối.
- View Voters: Xem danh sách thành viên đã bỏ phiếu.
- Payout: Thanh toán cho người thụ hưởng sau khi thỏa mãn điều kiện hợp đồng.

## 6. Hướng dẫn cài đặt

Yêu cầu: Node.js, npm và ví MetaMask.

### Chạy Hardhat

```bash
cd hardhat-project
npm install
npx hardhat compile
```

Để triển khai hợp đồng lên Sepolia, cần cấu hình file `.env` theo các biến môi trường được sử dụng trong `hardhat.config.js`.

Không đưa Private Key thật lên GitHub.

### Chạy website React

```bash
cd dominion-dao-frontend
npm install
npm run dev
```

Tạo file `.env` trong thư mục frontend:

```env
VITE_CONTRACT_ADDRESS=0x7868106024464071523837a325F2447b3c8E064B
```

Truy cập địa chỉ localhost mà Vite cung cấp, thông thường là:

`http://localhost:5173/`

**Lưu ý:** Nếu nhóm sử dụng một DominionDAO khác, cần thay `VITE_CONTRACT_ADDRESS` bằng địa chỉ hợp đồng tương ứng và bảo đảm ABI phù hợp.

## 7. Bảo mật

- Không commit `.env`, Private Key hoặc Seed Phrase.
- Không chia sẻ khóa ví giữa các thành viên.
- Sử dụng SepoliaETH thử nghiệm, không phải ETH trên Ethereum Mainnet.

## 8. Trạng thái dự án

Dự án đã hoàn thành triển khai Smart Contract và tích hợp các chức năng Web3 cơ bản. Quy trình bỏ phiếu và thanh toán DAO đang trong giai đoạn kiểm thử.

## 9. Mục đích

Dự án phục vụ học tập và thực hành Blockchain tại PTIT, giúp tìm hiểu cách Smart Contract, ví MetaMask và ứng dụng React tương tác với nhau.

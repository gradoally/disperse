import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, fromNano, Dictionary, Address } from '@ton/core';
import { Disperse } from '../wrappers/Disperse';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
describe('Disperse', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let disperseContract: SandboxContract<Disperse>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = 100;
        deployer = await blockchain.treasury('deployer');
        disperseContract = blockchain.openContract(Disperse.createFromConfig({ OwnerAddress: deployer.address, }, await compile('Disperse')));
        const deployResult = await disperseContract.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address, to: disperseContract.address, deploy: true, success: true, }); });
    it('empty test', async () => {});
    it('should add wallet', async () => {
        let wallet_arr = await blockchain.createWallets(5);
        const balance = await deployer.getBalance();
        console.log(`Deployer Balance: ${fromNano(balance)}`);
        for (let i = 0; i < wallet_arr.length; i++) {     
            console.log(`adding ${wallet_arr[i].address}`);
            const addResult = await disperseContract.sendAddWallet(deployer.getSender(), wallet_arr[i].address, toNano('1'), );
            expect(addResult.transactions).toHaveTransaction({ from: deployer.address, to: disperseContract.address, success: true, }); }
        let wallets = await disperseContract.getWallets();
        const result = wallets!.beginParse().loadDictDirect(Dictionary.Keys.BigUint(32), Dictionary.Values.Address());
        let address: number | Address | undefined; address = 0; for (let i = 0; address !== undefined; i++) { address = result.get(BigInt(i));
            if (address !== undefined) { expect(address).toEqualAddress(wallet_arr[i].address); console.log(address); }; } });
    it('the next test', async () => {});
});

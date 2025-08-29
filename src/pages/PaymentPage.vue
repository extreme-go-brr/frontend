<template>
  <q-page style="background-color: #F0F0F0;">
    <div class="row col-12 bg-white text-black" style="height: 200px;">
      <div class="col-md-4 q-pt-xl q-pl-lg"><q-btn color="primary" icon="arrow_back" to="/profile/transaksi" /></div>
      <div class="col-md-4 " align="center"> <img src="/icons/logo.svg" width="254px" style="margin-top: 48px;" alt=""></div>

    </div>

 <div class="triangle-down row justify-center">
  <div style="margin-top: -104px;"><img src="/QRIS.png" alt="">
  </div>
  <div class="q-pt-md">
  <q-btn color="primary" label="Continue the Process" style="width: 334px;" />
</div>
</div>
</q-page>
</template>

<style>
.triangle-down {
  border-left: clamp(100px, 50vw, 960px) solid transparent;
  border-right: clamp(100px, 50vw, 960px) solid transparent;
  border-top: 44px solid white ;
  filter: drop-shadow(0 4px 1px rgba(0, 0, 0, 0.5));
}
</style>

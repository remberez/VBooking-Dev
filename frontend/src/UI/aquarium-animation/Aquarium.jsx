import "./Aquarium.css";

function Aquarium({ className }) {
    return (
        <div class={`aquarium ${className}`}>
  <div class="aquarium__table"></div>
  <div class="aquarium__aquarium">
    <div class="aquarium__water"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
    <div class="aquarium__bubble"></div>
  </div>
  <div class="aquarium__drops">
    <div class="aquarium__drop"></div>
    <div class="aquarium__water-column"></div>
    <div class="aquarium__splash"></div>
    <div class="aquarium__splash"></div>
  </div>
  <div class="aquarium__sponge-box">
    <div class="aquarium__body">
      <div class="aquarium__body-stripe"></div>
      <div class="aquarium__body-hole"></div>
    </div>
    <div class="aquarium__face">
      <div class="aquarium__mouth"></div>
      <div class="aquarium__smile"></div>
    </div>
  </div>
</div>
    )
}

export default Aquarium;
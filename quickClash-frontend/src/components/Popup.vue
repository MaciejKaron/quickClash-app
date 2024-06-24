<template>
    <transition name="modal-fade">
      <div class="modal-backdrop">
        <div class="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
        >
          <header
            class="modal-header"
            id="modalTitle"
          >
            <slot name="header">
              <!-- This is the default tile! -->
            </slot>
            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
            >
              x
            </button>
          </header>
  
          <section
            class="modal-body"
            id="modalDescription"
          >
            <slot name="body">
              <!-- This is the default body! -->
            </slot>
          </section>
  
          <footer class="modal-footer">
            <slot name="footer">
              <!-- This is the default footer! -->
            </slot>
            <button
              type="button"
              class="btn-green"
              @click="close"
              aria-label="Close modal"
            >
              Close!
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </template>

<script>
    export default {
      name: 'Modal-comp',
      methods: {
        close() {
          this.$emit('close');
        },
      },
    };
  </script>

<style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.4);
    }
  
    .modal {
      position: fixed;
      top: 50%;
      bottom: 0;
      left: 50%;
      right: 0;
      transform: translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      background: #1a1a1d;
      box-shadow: 2px 2px 20px 1px;
      overflow-x: auto;
      max-width: 26em;
      max-height: 20em;
    }
  
    .modal-header,
    .modal-footer {
      padding: 15px;
      /* display: flex; */
    }
  
    .modal-header {
      border-bottom: 1px solid #eeeeee;
      color: white;
      font-family: roboto;
      text-align: center !important;
    }
  
    .modal-footer {
      border-top: 1px solid #eeeeee;
      flex-direction: column;
    }
  
    .modal-body {
      position: relative;
      padding: 20px 10px;
      margin-top: 1em;
      margin-right: auto;
      margin-bottom: 0;
      margin-left: auto;
      text-align: center; 
      overflow-x: hidden;
      overflow-y:auto;
    }
  
    .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        background-color: #6f2232;
        color: white;
        border: 2px solid #950740;
        border-radius:5px;
        cursor: pointer;
        filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
        transition: .5s;
    }

    .btn-close:hover {
        color: white;
        background-color: #c3073f;
        filter: drop-shadow(0 0 6px #950740);
    }
  
    .btn-green {
        background-color: #6f2232;
        color: white;
        border: 2px solid #950740;
        border-radius:5px;
        cursor: pointer;
        filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
        transition: .5s;
    }

    .btn-green:hover {
        color: white;
        background-color: #c3073f;
        filter: drop-shadow(0 0 6px #950740);
    }
  
    .modal-fade-enter,
    .modal-fade-leave-to {
      opacity: 0;
    }
  
    .modal-fade-enter-active,
    .modal-fade-leave-active {
      transition: opacity .5s ease;
    }
  </style>
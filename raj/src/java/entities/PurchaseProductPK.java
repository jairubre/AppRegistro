/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

/**
 *
 * @author Jairubre
 */
@Embeddable
public class PurchaseProductPK implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "purchase_id")
    private long purchaseId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "product_id")
    private long productId;

    public PurchaseProductPK() {
    }

    public PurchaseProductPK(long purchaseId, long productId) {
        this.purchaseId = purchaseId;
        this.productId = productId;
    }

    public long getPurchaseId() {
        return purchaseId;
    }

    public void setPurchaseId(long purchaseId) {
        this.purchaseId = purchaseId;
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) purchaseId;
        hash += (int) productId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof PurchaseProductPK)) {
            return false;
        }
        PurchaseProductPK other = (PurchaseProductPK) object;
        if (this.purchaseId != other.purchaseId) {
            return false;
        }
        if (this.productId != other.productId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entities.PurchaseProductPK[ purchaseId=" + purchaseId + ", productId=" + productId + " ]";
    }
    
}
